import { Router } from "express";
import mongoose from "mongoose";

import Pet from "../models/pet";
import {
  requireAuth,
  AuthRequest,
} from "../middleware/auth";

const router = Router();

// =====================================================
// GET MY PETS
// GET /api/pets
// =====================================================

router.get(
  "/",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
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
        "❌ Failed to fetch pets:",
        error
      );

      return res.status(500).json({
        error: "Failed to fetch pets",
      });
    }
  }
);

// =====================================================
// CREATE PET
// POST /api/pets
// =====================================================

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

      if (
        !mongoose.Types.ObjectId.isValid(
          req.userId
        )
      ) {
        return res.status(401).json({
          error: "Invalid authenticated user",
        });
      }

      // Never trust owner_id or id from frontend
      const {
        id: _id,
        _id: __id,
        owner_id: _ownerId,
        ...payload
      } = req.body || {};

      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (
        !payload.name ||
        !String(payload.name).trim()
      ) {
        return res.status(400).json({
          error: "Pet name is required",
        });
      }

      if (
        !payload.breed ||
        !String(payload.breed).trim()
      ) {
        return res.status(400).json({
          error: "Breed is required",
        });
      }

      if (
        ![
          "dog",
          "cat",
          "rabbit",
        ].includes(payload.species)
      ) {
        return res.status(400).json({
          error:
            "Species must be dog, cat, or rabbit",
        });
      }

      if (
        ![
          "male",
          "female",
        ].includes(payload.gender)
      ) {
        return res.status(400).json({
          error:
            "Gender must be male or female",
        });
      }

      // -------------------------------
      // CREATE PET
      // -------------------------------

      const pet = await Pet.create({
        ...payload,

        owner_id:
          new mongoose.Types.ObjectId(
            req.userId
          ),

        name: String(
          payload.name
        ).trim(),

        breed: String(
          payload.breed
        ).trim(),

        ageYears: Number(
          payload.ageYears ?? 0
        ),

        ageMonths: Number(
          payload.ageMonths ?? 0
        ),

        weightKg: Number(
          payload.weightKg ?? 0
        ),

        color: String(
          payload.color ?? ""
        ).trim(),

        photoUrl: String(
          payload.photoUrl ?? ""
        ).trim(),

        allergies:
          Array.isArray(
            payload.allergies
          )
            ? payload.allergies
            : [],

        vaccinations:
          Array.isArray(
            payload.vaccinations
          )
            ? payload.vaccinations
            : [],

        medicalHistory:
          Array.isArray(
            payload.medicalHistory
          )
            ? payload.medicalHistory
            : [],
      });

      console.log(
        `🐾 Pet registered: ${pet.name}`
      );

      return res.status(201).json({
        pet,
      });
    } catch (error) {
      console.error(
        "❌ Failed to create pet:",
        error
      );

      if (
        error instanceof
        mongoose.Error.ValidationError
      ) {
        return res.status(400).json({
          error: Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
        });
      }

      return res.status(500).json({
        error:
          "Failed to register pet",
      });
    }
  }
);

// =====================================================
// GET ONE PET
// GET /api/pets/:id
// =====================================================

router.get(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
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
        await Pet.findOne({
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
        "❌ Failed to fetch pet:",
        error
      );

      return res.status(500).json({
        error: "Failed to fetch pet",
      });
    }
  }
);

// =====================================================
// UPDATE PET
// PUT /api/pets/:id
// =====================================================

router.put(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error: "Invalid pet ID",
        });
      }

      const {
        id: _id,
        _id: __id,
        owner_id: _ownerId,
        ...updates
      } = req.body || {};

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
        "❌ Failed to update pet:",
        error
      );

      if (
        error instanceof
        mongoose.Error.ValidationError
      ) {
        return res.status(400).json({
          error: Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
        });
      }

      return res.status(500).json({
        error:
          "Failed to update pet",
      });
    }
  }
);

// =====================================================
// DELETE PET
// DELETE /api/pets/:id
// =====================================================

router.delete(
  "/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
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
        "❌ Failed to delete pet:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to delete pet",
      });
    }
  }
);

export default router;