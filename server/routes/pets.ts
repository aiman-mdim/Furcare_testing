import express from "express";
import mongoose from "mongoose";

import Pet from "../models/Pet";
import {
  requireAuth,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();

// ============================================
// GET ALL PETS FOR LOGGED-IN USER
// ============================================

router.get(
  "/",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const pets = await Pet.find({
        owner_id: req.userId,
      }).sort({
        createdAt: -1,
      });

      return res.json({
        pets,
      });
    } catch (error) {
      console.error(
        "GET /api/pets error:",
        error
      );

      return res.status(500).json({
        error: "Failed to fetch pets",
      });
    }
  }
);

// ============================================
// CREATE PET
// ============================================

router.post(
  "/",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const {
        name,
        species,
        breed,
        ageYears,
        ageMonths,
        color,
        weightKg,
        gender,
        photoUrl,
        allergies,
        vaccinations,
        medicalHistory,
        microchipId,
      } = req.body;

      // -------------------------------
      // Validation
      // -------------------------------

      if (!name) {
        return res.status(400).json({
          error: "Pet name is required",
        });
      }

      if (
        !species ||
        !["dog", "cat", "rabbit"].includes(
          species
        )
      ) {
        return res.status(400).json({
          error:
            "Species must be dog, cat, or rabbit",
        });
      }

      if (!breed) {
        return res.status(400).json({
          error: "Breed is required",
        });
      }

      if (
        !gender ||
        !["male", "female"].includes(
          gender
        )
      ) {
        return res.status(400).json({
          error:
            "Gender must be male or female",
        });
      }

      // -------------------------------
      // Create pet
      // -------------------------------
      //
      // IMPORTANT:
      // owner_id comes from JWT.
      //
      // We DO NOT accept owner_id
      // from the frontend.
      // -------------------------------

      const pet = await Pet.create({
        owner_id: new mongoose.Types.ObjectId(
          req.userId
        ),

        name: String(name).trim(),

        species,

        breed: String(breed).trim(),

        ageYears:
          Number.isFinite(
            Number(ageYears)
          )
            ? Number(ageYears)
            : 0,

        ageMonths:
          Number.isFinite(
            Number(ageMonths)
          )
            ? Number(ageMonths)
            : 0,

        color:
          typeof color === "string"
            ? color.trim()
            : "",

        weightKg:
          Number.isFinite(
            Number(weightKg)
          )
            ? Number(weightKg)
            : 0,

        gender,

        photoUrl:
          typeof photoUrl === "string"
            ? photoUrl
            : "",

        allergies:
          Array.isArray(allergies)
            ? allergies
            : [],

        vaccinations:
          Array.isArray(vaccinations)
            ? vaccinations
            : [],

        medicalHistory:
          Array.isArray(
            medicalHistory
          )
            ? medicalHistory
            : [],

        microchipId:
          typeof microchipId === "string"
            ? microchipId.trim()
            : "",
      });

      return res.status(201).json({
        pet,
      });
    } catch (error) {
      console.error(
        "POST /api/pets error:",
        error
      );

      return res.status(500).json({
        error: "Failed to register pet",
      });
    }
  }
);

// ============================================
// GET ONE PET
// ============================================

router.get(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error: "Invalid pet ID",
        });
      }

      const pet = await Pet.findOne({
        _id: req.params.id,

        owner_id: req.userId,
      });

      if (!pet) {
        return res.status(404).json({
          error: "Pet not found",
        });
      }

      return res.json({
        pet,
      });
    } catch (error) {
      console.error(
        "GET /api/pets/:id error:",
        error
      );

      return res.status(500).json({
        error: "Failed to fetch pet",
      });
    }
  }
);

// ============================================
// UPDATE PET
// ============================================

router.put(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error: "Invalid pet ID",
        });
      }

      // Never allow frontend to change owner
      const {
        owner_id,
        _id,
        createdAt,
        updatedAt,
        ...updates
      } = req.body;

      const pet =
        await Pet.findOneAndUpdate(
          {
            _id: req.params.id,

            owner_id: req.userId,
          },

          updates,

          {
            new: true,

            runValidators: true,
          }
        );

      if (!pet) {
        return res.status(404).json({
          error: "Pet not found",
        });
      }

      return res.json({
        pet,
      });
    } catch (error) {
      console.error(
        "PUT /api/pets/:id error:",
        error
      );

      return res.status(400).json({
        error: "Failed to update pet",
      });
    }
  }
);

// ============================================
// DELETE PET
// ============================================

router.delete(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error: "Invalid pet ID",
        });
      }

      const pet =
        await Pet.findOneAndDelete({
          _id: req.params.id,

          owner_id: req.userId,
        });

      if (!pet) {
        return res.status(404).json({
          error: "Pet not found",
        });
      }

      return res.json({
        message:
          "Pet deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE /api/pets/:id error:",
        error
      );

      return res.status(500).json({
        error: "Failed to delete pet",
      });
    }
  }
);

export default router;