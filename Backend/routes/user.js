const express = require("express");
const router = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../config/db");
const { Account } = require("../config/db");
const { JWT_SECRET } = require("./config");
const { authMiddleware } = require("./middleware");
// Login function
const loginSchema = z.object({
  username: z.string().email("Invalid user name"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "All fields are required!" });
  }
  try {
    const { success } = loginSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).send({ message: "Incorrect Inputs!" });
    }
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).send({ message: "User not found" });
    }
    const account = await Account.findOne({ userId: existingUser._id });
    if (!account) {
      return res.status(404).send({ message: "Account not found" });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(400).send({ message: "Wrong password" });
    }

    const jwtToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).send({
      username: `${existingUser.firstName} ${existingUser.lastName}`,
      balance: account.balance,
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error logging in!", error: error });
  }
});

// Logout function
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).send({ message: "Error logging out!", error });
  }
});

// Search bulk users function
router.get("/searchBulk", async (req, res) => {
  const searchTerm = (req.query.user || "").toString();
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(searchTerm, "i") } },
        { lastName: { $regex: new RegExp(searchTerm, "i") } },
      ],
      _id: { $ne: req._id },
    });
    return res.status(200).send({
      users: users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      })),
    });
  } catch (error) {
    return res.status(500).send({ message: "Error searching users!" });
  }
});

// Signup function
const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  username: z.string().email("Invalid user name"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

router.post("/signup", async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already taken/Incorrect inputs",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
      userId,
      balance: parseFloat((1 + Math.random() * 10000).toFixed(2)),
    });

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

router.post("/info", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
router.put("/upate", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.send(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne(req.body, {
    id: req.userId,
  });
  res.json({
    message: "updated successfully",
  });
});

router.get("/decode", authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Authorization token missing or malformed" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      userId: decoded._id,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});
module.exports = router;
