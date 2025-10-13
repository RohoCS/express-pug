import express from "express";

import pug from "pug";

const app = express();
const PORT = 3000;

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

app.set("view engine", "pug");
app.set("views", "./src/pug");

// app.set("view engine", "ejs");
// app.set("views", "./src/ejs");

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
