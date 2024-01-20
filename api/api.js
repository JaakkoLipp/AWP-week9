const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv").config();
const passport = require("../passport-config");
const { body, validationResult } = require("express-validator");
const Todo = require("../models/todo");

// POST route for registr
router.post(
  "/user/register/",
  [
    // Validate email
    body("email").isEmail().normalizeEmail(),
    // Validate password
    body("password")
      .isLength({ min: 8 })
      .matches(/[a-z]/)
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .matches(/[~`!@#$%^&*()-_+={}[\]|\\;:"<>,./?]/),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Hash with bcrypt
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hashedPassword) {
          console.log(password, hashedPassword);
          // Create a new user
          const newUser = new User({
            email,
            password: hashedPassword,
          });

          try {
            // Save the user to the database
            await newUser.save();
            // Return success status
            res.sendStatus(200);
          } catch (error) {
            if (error.code === 11000) {
              // Duplicate email error
              return res.status(403).json({ email: "Email already in use" });
            } else {
              console.error(error);
              res.sendStatus(500);
            }
          }
        });
      });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

// POST route for user login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    console.log(password, user.password);
    const passwordMatch = bcrypt.compareSync(
      password,
      user.password,
      function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
    console.log(password, user.password, passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET
    );

    // Return the JWT token
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get(
  "/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Authentication successful
    res.json({ email: req.user.email });
  }
);

router.post(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { items } = req.body;
      let todo = await Todo.findOne({ user: req.user._id });

      if (!todo) {
        // create new list
        todo = new Todo({
          user: req.user._id,
          items,
        });
      } else {
        // append new items
        todo.items.push(...items);
      }

      await todo.save();
      res.json({ todo });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
