// =====================
// DOTENV
// =====================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MIDDLEWARE
===================== */
<<<<<<< HEAD
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

=======
app.use(cors({
  origin: "https://sga.santos-tech.com",
  credentials: true
}));
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   POSTGRES
===================== */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

/* =====================
   SESSION
===================== */
<<<<<<< HEAD
=======
app.set("trust proxy", 1);

>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
app.use(session({
  store: new pgSession({
    pool,
    tableName: "session"
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none" // ⚠️ essencial para frontend + api em domínios diferentes
  }
}));

/* =====================
   PASSPORT
===================== */
app.use(passport.initialize());
app.use(passport.session());

/* =====================
<<<<<<< HEAD
=======
   USER TABLE
===================== */
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario TEXT UNIQUE,
    email TEXT UNIQUE,
    nome TEXT,
    senha TEXT,
    google_id TEXT,
    foto TEXT
  )
`);

/* =====================
   LOCAL STRATEGY
===================== */
passport.use(new LocalStrategy(
  { usernameField: "usuario", passwordField: "senha" },
  async (username, senha, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM usuarios WHERE usuario=$1 OR email=$1",
        [username]
      );

      const user = rows[0];
      if (!user || !user.senha) return done(null, false);

      const ok = await bcrypt.compare(senha, user.senha);
      if (!ok) return done(null, false);

      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

/* =====================
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
   GOOGLE STRATEGY
===================== */
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
<<<<<<< HEAD
    callbackURL: `${process.env.API_URL}/auth/google/callback`
=======
    callbackURL: "https://api.sga.santos-tech.com/auth/google/callback"
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
  },
  async (_, __, profile, done) => {
    const email = profile.emails[0].value;
    const nome = profile.displayName;
    const foto = profile.photos[0].value;
    const googleId = profile.id;

    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1",
      [email]
    );

    if (rows[0]) return done(null, rows[0]);

    const result = await pool.query(
      `INSERT INTO usuarios (email,nome,google_id,foto)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [email, nome, googleId, foto]
    );

    done(null, result.rows[0]);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
<<<<<<< HEAD
  const { rows } = await pool.query(
    "SELECT * FROM usuarios WHERE id=$1",
    [id]
  );
=======
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE id=$1", [id]);
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
  done(null, rows[0]);
});

/* =====================
   ROUTES
===================== */
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get("/me", (req, res) => {
  if (!req.isAuthenticated()) return res.json({ logged: false });
  res.json({ logged: true, user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout(() => res.json({ success: true }));
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
<<<<<<< HEAD
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => res.redirect(process.env.FRONTEND_URL)
=======
  passport.authenticate("google", { failureRedirect: "https://sga.santos-tech.com/login" }),
  (req, res) => res.redirect("https://sga.santos-tech.com")
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
);

/* =====================
   START
===================== */
app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`🚀 API rodando na porta ${PORT}`);
=======
  console.log(`🚀 Backend rodando na porta ${PORT}`);
>>>>>>> 3dac2424cdf95aee12514c426949517f334e67bf
});
