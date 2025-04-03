import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Book from "./models/Book.js";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/library", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SECRET = "mySecretKey";

// Signup
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.send({ message: "User created" });
  } catch (error) {
    res.status(400).send({ error: "Username already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send({ error: "Incorrect password" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.send({ token });
});

// Book Routes
app.post("/api/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.send(book);
});

app.get("/api/books", async (req, res) => {
  const search = req.query.search || "";
  const books = await Book.find({
    title: { $regex: search, $options: "i" },
  });
  res.send(books);
});

app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
