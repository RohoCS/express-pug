import express from "express";
import pug from "pug";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import session from "express-session";
import bcrypt from "bcryptjs";

import authenticateJWT from "./middleware/jwt.middleware.js";
import passport, { initializePassport } from "./config/passport.config.js";
import { ensureAuthenticated } from "./middleware/auth.middleware.js";

const app = express();
const PORT = 3000;
const SECRET_KEY = "SECRET_KEY";
const SESSION_SECRET = "SESSION_SECRET_KEY";

const USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    id: 3,
    name: "Doe John",
    email: "doe.john@example.com",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "Article 1",
    content: "Content of article 1",
  },
  {
    id: 2,
    title: "Article 2",
    content: "Content of article 2",
  },
  {
    id: 3,
    title: "Article 3",
    content: "Content of article 3",
  },
];

const registeredUsers = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

initializePassport(registeredUsers);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "pug");
app.set("views", "./src/pug");

// app.set("view engine", "ejs");
// app.set("views", "./src/ejs");

// theme
app.post("/set-theme", (req, res) => {
  const { theme } = req.body;

  if (!theme || !["light", "dark", "auto"].includes(theme)) {
    return res
      .status(400)
      .json({ message: "Невірна тема. Доступні: light, dark, auto" });
  }

  res.cookie("preferredTheme", theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "lax",
  });

  res.json({ message: `Тему "${theme}" збережено успішно!`, theme });
});

app.get("/get-theme", (req, res) => {
  const theme = req.cookies.preferredTheme || "light";
  res.json({ theme });
});

// reg
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Всі поля обов'язкові: username, password, email" });
  }

  const existingUser = registeredUsers.find((u) => u.email === email);
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Користувач з таким email вже існує" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: registeredUsers.length + 1,
      username,
      password: hashedPassword,
      email,
    };
    registeredUsers.push(newUser);

    res.status(201).json({
      message: "Користувача зареєстровано успішно!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка при реєстрації користувача" });
  }
});

// login
app.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email та password обов'язкові" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Помилка сервера" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Невірні облікові дані" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Помилка при вході" });
      }

      res.json({
        message: "Вхід виконано успішно!",
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  })(req, res, next);
});

// exit
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Помилка при виході" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Помилка при знищенні сесії" });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Вихід виконано успішно!" });
    });
  });
});

// protected
app.get("/profile", authenticateJWT, (req, res) => {
  res.json({
    message: "Це захищений маршрут",
    user: req.user,
  });
});

app.get("/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.get("/protected", ensureAuthenticated, (req, res) => {
  res.json({
    message: "Це захищений маршрут /protected",
    user: req.user,
    sessionID: req.sessionID,
  });
});

// =====================
app.get("/users", (req, res) => {
  res.render("users", { users: USERS });
});

app.get("/users/:id", (req, res) => {
  const user = USERS.find((user) => user.id == req.params.id);
  res.render("user", { user });
});

app.get("/articles", (req, res) => {
  res.render("articles", { articles: ARTICLES });
});

app.get("/articles/:id", (req, res) => {
  const article = ARTICLES.find((article) => article.id == req.params.id);
  res.render("article", { article });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
