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
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

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
   GOOGLE STRATEGY
===================== */
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`
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
  const { rows } = await pool.query(
    "SELECT * FROM usuarios WHERE id=$1",
    [id]
  );
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
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => res.redirect(process.env.FRONTEND_URL)
);

/* =====================
   START
===================== */
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
