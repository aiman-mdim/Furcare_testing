import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User, UserRole } from "../models/User";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

function publicUser(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
    isPremium: user.isPremium,
  };
}

function createToken(user: any) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    secret,
    {
      expiresIn: "7d",
    }
  );
}

function setAuthCookie(res: any, token: string) {
  res.cookie("furcare_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      role = "pet_owner",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const allowedRoles = [
      "pet_owner",
      "vet",
      "groomer",
      "shelter",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid account role",
      });
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(
      String(password),
      12
    );

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone,
      city,
      passwordHash,
      role: role as UserRole,
    });

    const token = createToken(user);

    setAuthCookie(res, token);

    return res.status(201).json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Registration failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = createToken(user);

    setAuthCookie(res, token);

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

router.post("/logout", (_req, res) => {
  res.clearCookie("furcare_token");

  return res.json({
    message: "Logged out successfully",
  });
});

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.json({
        user: publicUser(user),
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to retrieve user",
      });
    }
  }
);

export default router;
