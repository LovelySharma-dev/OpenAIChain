import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_jwt_key_change_in_production";

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with free 1000 OAC tokens
    const user = await User.create({ 
      email, 
      password: hashed, 
      name: name || email.split('@')[0],
      tokenBalance: 1000 
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      tokenBalance: user.tokenBalance,
      totalRewards: user.totalRewards,
      modelsContributed: user.modelsContributed,
      role: user.role
    };

    res.json({ 
      success: true, 
      token, 
      user: userData 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if user has password (for existing users without password)
    if (!user.password) {
      return res.status(400).json({ 
        success: false,
        message: "Please set a password first. Use signup to create an account." 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      tokenBalance: user.tokenBalance,
      totalRewards: user.totalRewards,
      modelsContributed: user.modelsContributed,
      role: user.role,
      walletAddress: user.walletAddress
    };

    res.json({ 
      success: true, 
      token, 
      user: userData 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Get current user (protected route)
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      tokenBalance: user.tokenBalance,
      totalRewards: user.totalRewards,
      modelsContributed: user.modelsContributed,
      role: user.role,
      walletAddress: user.walletAddress
    };

    res.json({ 
      success: true, 
      user: userData 
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }
    console.error("Get user error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

export default router;

