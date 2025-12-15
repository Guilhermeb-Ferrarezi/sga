// =====================
// DOTENV (apenas em dev)
// =====================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;

/* =====================
   CONFIGURAÇÕES GERAIS
===================== */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* =====================
   BANCO POSTGRESQL
===================== */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || process.env.DB_PASS),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
  console.log("📦 Banco de dados PostgreSQL conectado");
});

pool.on("error", (err) => {
  console.error("❌ Erro no pool PostgreSQL:", err);
});

/* =====================
   SESSION (PRODUÇÃO)
===================== */
app.set("trust proxy", 1); // importante para HTTPS atrás de proxy

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: "session"
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS
    httpOnly: true,
    sameSite: "lax"
  }
}));

/* =====================
   PASSPORT
===================== */
app.use(passport.initialize());
app.use(passport.session());

/* =====================
   SERVIR FRONTEND
===================== */
app.use(express.static(path.join(__dirname, "..")));

/* =====================
   TABELA USUÁRIOS
===================== */
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario TEXT UNIQUE,
    email TEXT UNIQUE,
    nome TEXT,
    senha TEXT,
    google_id TEXT,
    foto TEXT,
    reset_token TEXT,
    reset_expires BIGINT
  )
`).catch(err => console.error("Erro ao criar tabela usuarios:", err));

/* =====================
   PASSPORT LOCAL
===================== */
passport.use(new LocalStrategy(
  {
    usernameField: "usuario",
    passwordField: "senha"
  },
  async (username, senha, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM usuarios WHERE usuario = $1 OR email = $1",
        [username]
      );

      const user = result.rows[0];
      if (!user) {
        return done(null, false, { message: "Usuário ou email não encontrado" });
      }

      if (!user.senha) {
        return done(null, false, { message: "Use login com Google" });
      }

      const senhaOk = await bcrypt.compare(senha, user.senha);
      if (!senhaOk) {
        return done(null, false, { message: "Senha incorreta" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

/* =====================
   PASSPORT GOOGLE
===================== */
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (_, __, profile, done) => {
    try {
      const googleId = profile.id;
      const nome = profile.displayName.split(" ")[0];
      const email = profile.emails[0].value;
      const foto = profile.photos[0].value;

      const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (result.rows[0]) {
        await pool.query(
          "UPDATE usuarios SET google_id=$1, nome=$2, foto=$3 WHERE email=$4",
          [googleId, nome, foto, email]
        );
        return done(null, result.rows[0]);
      }

      const newUser = await pool.query(
        `INSERT INTO usuarios (google_id, nome, email, foto)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [googleId, nome, email, foto]
      );

      return done(null, newUser.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

/* =====================
   SERIALIZE
===================== */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

/* =====================
   ROTAS GOOGLE
===================== */
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => res.redirect("/index.html")
);

/* =====================
   LOGIN
===================== */
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json({ success: false, message: info.message });

    req.login(user, err => {
      if (err) return next(err);
      res.json({
        success: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          foto: user.foto
        }
      });
    });
  })(req, res, next);
});

/* =====================
   REGISTER
===================== */
app.post("/register", async (req, res) => {
  const { usuario, email, nome, senha } = req.body;
  if (!usuario || !email || !nome || !senha) {
    return res.json({ success: false });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      `INSERT INTO usuarios (usuario,email,nome,senha)
       VALUES ($1,$2,$3,$4)`,
      [usuario, email, nome, hash]
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false, message: "Usuário ou email já existe" });
  }
});

/* =====================
   ME
===================== */
app.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ logged: false });
  }

  res.json({
    logged: true,
    user: {
      id: req.user.id,
      nome: req.user.nome,
      email: req.user.email,
      foto: req.user.foto
    }
  });
});

/* =====================
   LOGOUT
===================== */
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login.html"));
});

/* =====================
   START SERVER
===================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

/* =====================
   GRACEFUL SHUTDOWN
===================== */
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🛑 Pool PostgreSQL fechado");
  process.exit(0);
});
