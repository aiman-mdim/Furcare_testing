import express, {
  Request,
  Response,
} from "express";

import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

import LostFound from "../models/LostFound";

import {
  requireAuth,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "lost-found"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| MULTER STORAGE
|--------------------------------------------------------------------------
*/

const storage =
  multer.diskStorage({
    destination: (
      _req,
      _file,
      cb
    ) => {
      cb(
        null,
        uploadDirectory
      );
    },

    filename: (
      _req,
      file,
      cb
    ) => {
      const extension =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();

      const safeName =
        `pet-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}${extension}`;

      cb(
        null,
        safeName
      );
    },
  });

/*
|--------------------------------------------------------------------------
| MULTER
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },

  fileFilter: (
    _req,
    file,
    cb
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

/*
|--------------------------------------------------------------------------
| DELETE FILE HELPER
|--------------------------------------------------------------------------
*/

function deleteFile(
  filePath?: string
) {
  if (
    !filePath ||
    !fs.existsSync(filePath)
  ) {
    return;
  }

  try {
    fs.unlinkSync(
      filePath
    );
  } catch (error) {
    console.error(
      "Could not delete file:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET ALL REPORTS
|--------------------------------------------------------------------------
|
| Everyone can read active reports.
|
| This is intentional because the requirement
| is that logged-in users can see reports
| registered by other users.
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const listings =
        await LostFound.find({
          status: "active",
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        listings,
      });
    } catch (error) {
      console.error(
        "GET lost-found error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to load lost and found reports.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET MY REPORTS
|--------------------------------------------------------------------------
|
| Only the authenticated user can access
| this endpoint.
|
|--------------------------------------------------------------------------
*/

router.get(
  "/mine",
  requireAuth,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error:
            "Authentication required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.userId
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid user ID.",
        });
      }

      const listings =
        await LostFound.find({
          owner_id:
            new mongoose.Types.ObjectId(
              req.userId
            ),
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        listings,
      });
    } catch (error) {
      console.error(
        "GET my lost-found reports error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to load your reports.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| CREATE LOST / FOUND REPORT
|--------------------------------------------------------------------------
|
| POST /api/lost-found
|
| multipart/form-data
|
| image = uploaded pet image
|
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | AUTH
      |--------------------------------------------------------------------------
      */

      if (!req.userId) {
        deleteFile(
          req.file?.path
        );

        return res.status(401).json({
          error:
            "You must be logged in to create a report.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.userId
        )
      ) {
        deleteFile(
          req.file?.path
        );

        return res.status(400).json({
          error:
            "Invalid authenticated user.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | IMAGE
      |--------------------------------------------------------------------------
      */

      if (!req.file) {
        return res.status(400).json({
          error:
            "Please upload a pet image.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | FORM DATA
      |--------------------------------------------------------------------------
      */

      const {
        type,
        petName,
        species,
        breed,
        color,
        eyeColor,
        faceStructure,
        collarNeckband,
        birthmarkOrFeature,
        lastWearCloth,
        lastLocation,
        contactPhone,
        contactName,
        reportedDate,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | VALIDATE TYPE
      |--------------------------------------------------------------------------
      */

      if (
        type !== "lost" &&
        type !== "found"
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Report type must be lost or found.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | VALIDATE SPECIES
      |--------------------------------------------------------------------------
      */

      if (
        ![
          "dog",
          "cat",
          "rabbit",
        ].includes(species)
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Species must be dog, cat or rabbit.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | VALIDATE FACE STRUCTURE
      |--------------------------------------------------------------------------
      */

      if (
        ![
          "round",
          "long",
          "pointed",
          "flat",
        ].includes(
          faceStructure
        )
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Invalid face structure.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | REQUIRED FIELDS
      |--------------------------------------------------------------------------
      */

      if (
        !breed?.trim() ||
        !color?.trim() ||
        !eyeColor?.trim() ||
        !lastLocation?.trim() ||
        !contactPhone?.trim() ||
        !contactName?.trim()
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Please complete all required fields.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | PHOTO URL
      |--------------------------------------------------------------------------
      */

      const photoUrl =
        `/uploads/lost-found/${req.file.filename}`;

      /*
      |--------------------------------------------------------------------------
      | CREATE DATABASE DOCUMENT
      |--------------------------------------------------------------------------
      */

      const listing =
        new LostFound({
          owner_id:
            new mongoose.Types.ObjectId(
              req.userId
            ),

          type,

          petName:
            petName?.trim() ||
            undefined,

          species,

          breed:
            breed.trim(),

          color:
            color.trim(),

          eyeColor:
            eyeColor.trim(),

          faceStructure,

          collarNeckband:
            collarNeckband?.trim() ||
            undefined,

          birthmarkOrFeature:
            birthmarkOrFeature?.trim() ||
            undefined,

          lastWearCloth:
            lastWearCloth?.trim() ||
            undefined,

          lastLocation:
            lastLocation.trim(),

          contactPhone:
            contactPhone.trim(),

          contactName:
            contactName.trim(),

          photoUrl,

          status:
            "active",

          reportedDate:
            reportedDate ||
            new Date()
              .toISOString()
              .split("T")[0],
        });

      /*
      |--------------------------------------------------------------------------
      | SAVE
      |--------------------------------------------------------------------------
      */

      await listing.save();

      /*
      |--------------------------------------------------------------------------
      | RETURN
      |--------------------------------------------------------------------------
      */

      return res.status(201).json({
        success: true,
        listing,
      });
    } catch (error) {
      console.error(
        "CREATE lost-found error:",
        error
      );

      deleteFile(
        req.file?.path
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create report.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| RESOLVE REPORT
|--------------------------------------------------------------------------
|
| Only the owner of the report can resolve it.
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/resolve",
  requireAuth,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error:
            "Authentication required.",
        });
      }

      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid report ID.",
        });
      }

      const listing =
        await LostFound.findOne({
          _id: id,

          owner_id:
            new mongoose.Types.ObjectId(
              req.userId
            ),
        });

      if (!listing) {
        return res.status(404).json({
          error:
            "Report not found or you do not own this report.",
        });
      }

      listing.status =
        "resolved";

      await listing.save();

      return res.json({
        success: true,
        listing,
      });
    } catch (error) {
      console.error(
        "Resolve report error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to resolve report.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE REPORT
|--------------------------------------------------------------------------
|
| Only the owner can delete the report.
|
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  requireAuth,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error:
            "Authentication required.",
        });
      }

      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid report ID.",
        });
      }

      const listing =
        await LostFound.findOne({
          _id: id,

          owner_id:
            new mongoose.Types.ObjectId(
              req.userId
            ),
        });

      if (!listing) {
        return res.status(404).json({
          error:
            "Report not found or you do not own this report.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Delete physical image
      |--------------------------------------------------------------------------
      */

      const relativePath =
        listing.photoUrl.replace(
          /^\/+/,
          ""
        );

      const filePath =
        path.join(
          process.cwd(),
          relativePath
        );

      deleteFile(
        filePath
      );

      /*
      |--------------------------------------------------------------------------
      | Delete database record
      |--------------------------------------------------------------------------
      */

      await LostFound.findByIdAndDelete(
        id
      );

      return res.json({
        success: true,
        message:
          "Report deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete report error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to delete report.",
      });
    }
  }
);

export default router;