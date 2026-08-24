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
  analyzePetImage,
  matchPetImages,
} from "../services/petImageAI";

const router = express.Router();

// ============================================
// UPLOAD DIRECTORY
// ============================================

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

// ============================================
// MULTER STORAGE
// ============================================

const storage = multer.diskStorage({
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
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename =
      `pet-${Date.now()}-` +
      `${Math.random()
        .toString(36)
        .substring(2, 9)}` +
      `${extension}`;

    cb(
      null,
      filename
    );
  },
});

// ============================================
// MULTER
// ============================================

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

// ============================================
// HELPERS
// ============================================

function getUserId(
  req: Request
): string | null {
  const user = (req as any).user;

  if (!user) {
    return null;
  }

  return (
    user.id ||
    user._id ||
    null
  );
}

// ============================================
// DELETE FILE SAFELY
// ============================================

function deleteFile(
  filePath?: string
): void {
  if (
    !filePath ||
    !fs.existsSync(filePath)
  ) {
    return;
  }

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(
      "Failed to delete file:",
      error
    );
  }
}

// ============================================
// PHOTO URL → LOCAL FILE
// ============================================

function photoUrlToFilePath(
  photoUrl: string
): string {
  const relativePath =
    photoUrl.replace(
      /^\/+/,
      ""
    );

  return path.join(
    process.cwd(),
    relativePath
  );
}

// ============================================
// GET ALL LISTINGS
// ============================================

router.get(
  "/",
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const listings =
        await LostFound.find()
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
          "Failed to load lost and found listings.",
      });
    }
  }
);

// ============================================
// GET FOUND PETS
// ============================================

router.get(
  "/found",
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const listings =
        await LostFound.find({
          type: "found",
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
        "GET found pets error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to load found pets.",
      });
    }
  }
);

// ============================================
// CREATE LOST / FOUND LISTING
// ============================================
//
// POST /api/lost-found
//
// Content-Type:
// multipart/form-data
//
// Image field:
// image
//
// ============================================

router.post(
  "/",
  upload.single("image"),
  async (
    req: Request,
    res: Response
  ) => {
    let savedListing:
      mongoose.Document | null = null;

    try {
      // ========================================
      // AUTHENTICATION
      // ========================================

      const userId =
        getUserId(req);

      if (!userId) {
        deleteFile(
          req.file?.path
        );

        return res.status(401).json({
          error:
            "You must be logged in to create a listing.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        deleteFile(
          req.file?.path
        );

        return res.status(400).json({
          error:
            "Invalid authenticated user ID.",
        });
      }

      // ========================================
      // IMAGE REQUIRED
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          error:
            "Pet image is required.",
        });
      }

      // ========================================
      // READ FORM DATA
      // ========================================

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

      // ========================================
      // VALIDATE TYPE
      // ========================================

      if (
        type !== "lost" &&
        type !== "found"
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Type must be lost or found.",
        });
      }

      // ========================================
      // VALIDATE REQUIRED FIELDS
      // ========================================

      if (
        !species ||
        !breed ||
        !color ||
        !eyeColor ||
        !faceStructure ||
        !lastLocation ||
        !contactPhone ||
        !contactName
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Please provide all required pet information.",
        });
      }

      // ========================================
      // VALIDATE SPECIES
      // ========================================

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

      // ========================================
      // VALIDATE FACE STRUCTURE
      // ========================================

      if (
        ![
          "round",
          "long",
          "pointed",
          "flat",
        ].includes(faceStructure)
      ) {
        deleteFile(
          req.file.path
        );

        return res.status(400).json({
          error:
            "Invalid face structure.",
        });
      }

      // ========================================
      // PHOTO URL
      // ========================================

      const photoUrl =
        `/uploads/lost-found/${req.file.filename}`;

      // ========================================
      // CREATE LISTING
      // ========================================

      const listing =
        new LostFound({
          owner_id:
            new mongoose.Types.ObjectId(
              userId
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

          status: "active",

          reportedDate:
            reportedDate ||
            new Date()
              .toISOString()
              .split("T")[0],
        });

      // ========================================
      // SAVE LISTING FIRST
      // ========================================

      await listing.save();

      savedListing = listing;

      // ========================================
      // AI IMAGE ANALYSIS
      // ========================================

      try {
        const imageFeatures =
          await analyzePetImage(
            req.file.path
          );

        listing.imageFeatures =
          imageFeatures;

        await listing.save();

        console.log(
          `AI analysis completed for ${listing._id}`
        );
      } catch (aiError) {
        console.error(
          "AI image analysis failed:",
          aiError
        );

        /*
         * The listing is still valid even
         * if AI analysis fails.
         */
      }

      // ========================================
      // RETURN LISTING
      // ========================================

      return res.status(201).json({
        success: true,
        listing,
      });
    } catch (error) {
      console.error(
        "CREATE lost-found error:",
        error
      );

      // ========================================
      // CLEAN UP UPLOADED IMAGE
      // ========================================

      deleteFile(
        req.file?.path
      );

      // ========================================
      // CLEAN UP DB RECORD IF NECESSARY
      // ========================================

      if (
        savedListing &&
        "_id" in savedListing
      ) {
        try {
          await LostFound.findByIdAndDelete(
            savedListing._id
          );
        } catch (deleteError) {
          console.error(
            "Failed to rollback listing:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create listing.",
      });
    }
  }
);

// ============================================
// AI PET IMAGE MATCHING
// ============================================
//
// POST /api/lost-found/match
//
// Content-Type:
// multipart/form-data
//
// Image field:
// image
//
// Searches the uploaded lost-pet image
// against active FOUND listings.
//
// ============================================

router.post(
  "/match",
  upload.single("image"),
  async (
    req: Request,
    res: Response
  ) => {
    try {
      // ========================================
      // AUTH
      // ========================================

      const userId =
        getUserId(req);

      if (!userId) {
        deleteFile(
          req.file?.path
        );

        return res.status(401).json({
          error:
            "You must be logged in to search for your pet.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        deleteFile(
          req.file?.path
        );

        return res.status(400).json({
          error:
            "Invalid authenticated user ID.",
        });
      }

      // ========================================
      // IMAGE REQUIRED
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          error:
            "Please upload a photo of your lost pet.",
        });
      }

      // ========================================
      // ANALYZE SEARCH IMAGE
      // ========================================

      let searchFeatures;

      try {
        searchFeatures =
          await analyzePetImage(
            req.file.path
          );
      } catch (error) {
        console.error(
          "Search image AI analysis failed:",
          error
        );

        deleteFile(
          req.file.path
        );

        return res.status(500).json({
          error:
            "AI could not analyze the uploaded pet image.",
        });
      }

      // ========================================
      // GET FOUND PETS
      // ========================================

      const foundPets =
        await LostFound.find({
          type: "found",
          status: "active",
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      if (!foundPets.length) {
        deleteFile(
          req.file.path
        );

        return res.json({
          matches: [],
          message:
            "There are currently no active found-pet listings.",
        });
      }

      // ========================================
      // BUILD AI CANDIDATES
      // ========================================

      const candidates =
        foundPets
          .map((pet) => {
            const imagePath =
              photoUrlToFilePath(
                pet.photoUrl
              );

            return {
              listingId:
                String(
                  pet._id
                ),

              imagePath,

              species:
                pet.species,

              breed:
                pet.breed,

              color:
                pet.color,

              eyeColor:
                pet.eyeColor,

              faceStructure:
                pet.faceStructure,

              imageFeatures:
                pet.imageFeatures,
            };
          })
          .filter(
            (candidate) =>
              fs.existsSync(
                candidate.imagePath
              )
          );

      // ========================================
      // NO VALID IMAGES
      // ========================================

      if (
        candidates.length === 0
      ) {
        deleteFile(
          req.file.path
        );

        return res.json({
          matches: [],
          message:
            "No valid found-pet images are currently available for AI matching.",
        });
      }

      // ========================================
      // RUN AI MATCHING
      // ========================================

      const matches =
        await matchPetImages(
          req.file.path,
          candidates
        );

      // ========================================
      // SAVE SEARCH FEATURES + MATCHES
      // ========================================
      //
      // If the authenticated user already
      // has an active lost-pet listing,
      // save the AI results there.
      //
      // ========================================

      const userLostListing =
        await LostFound.findOne({
          owner_id:
            new mongoose.Types.ObjectId(
              userId
            ),

          type: "lost",

          status: "active",
        }).sort({
          createdAt: -1,
        });

      if (userLostListing) {
        userLostListing.imageFeatures =
          searchFeatures;

        userLostListing.aiMatches =
          matches;

        await userLostListing.save();
      }

      // ========================================
      // MAP MATCH RESULTS
      // ========================================

      const matchMap =
        new Map(
          matches.map(
            (match) => [
              String(
                match.listingId
              ),
              match,
            ]
          )
        );

      const results =
        foundPets
          .filter((pet) =>
            matchMap.has(
              String(
                pet._id
              )
            )
          )
          .map((pet) => {
            const match =
              matchMap.get(
                String(
                  pet._id
                )
              );

            if (!match) {
              return null;
            }

            return {
              listingId:
                String(
                  pet._id
                ),

              confidence:
                match.confidence,

              reason:
                match.reason,

              listing:
                pet,
            };
          })
          .filter(
            (
              result
            ): result is NonNullable<
              typeof result
            > =>
              result !== null
          )
          .sort(
            (a, b) =>
              b.confidence -
              a.confidence
          );

      // ========================================
      // CLEAN TEMPORARY SEARCH IMAGE
      // ========================================

      deleteFile(
        req.file.path
      );

      // ========================================
      // RETURN RESULTS
      // ========================================

      return res.json({
        success: true,

        matches: results,

        analyzedFeatures:
          searchFeatures,
      });
    } catch (error) {
      console.error(
        "AI pet matching error:",
        error
      );

      deleteFile(
        req.file?.path
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "AI pet matching failed.",
      });
    }
  }
);

// ============================================
// GET ONE LISTING
// ============================================

router.get(
  "/:id",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid listing ID.",
        });
      }

      const listing =
        await LostFound.findById(
          req.params.id
        ).lean();

      if (!listing) {
        return res.status(404).json({
          error:
            "Listing not found.",
        });
      }

      return res.json({
        listing,
      });
    } catch (error) {
      console.error(
        "GET listing error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to load listing.",
      });
    }
  }
);

// ============================================
// DELETE LISTING
// ============================================

router.delete(
  "/:id",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      // ========================================
      // AUTH
      // ========================================

      const userId =
        getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error:
            "You must be logged in.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          error:
            "Invalid listing ID.",
        });
      }

      // ========================================
      // FIND LISTING
      // ========================================

      const listing =
        await LostFound.findById(
          req.params.id
        );

      if (!listing) {
        return res.status(404).json({
          error:
            "Listing not found.",
        });
      }

      // ========================================
      // OWNER CHECK
      // ========================================

      if (
        String(
          listing.owner_id
        ) !== String(userId)
      ) {
        return res.status(403).json({
          error:
            "You cannot delete this listing.",
        });
      }

      // ========================================
      // DELETE IMAGE
      // ========================================

      if (listing.photoUrl) {
        const imagePath =
          photoUrlToFilePath(
            listing.photoUrl
          );

        deleteFile(
          imagePath
        );
      }

      // ========================================
      // DELETE DATABASE RECORD
      // ========================================

      await listing.deleteOne();

      return res.json({
        success: true,
        message:
          "Listing deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE listing error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to delete listing.",
      });
    }
  }
);

// ============================================
// MULTER ERROR HANDLER
// ============================================

router.use(
  (
    error: any,
    _req: Request,
    res: Response,
    _next: express.NextFunction
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          error:
            "Image is too large. Maximum size is 10MB.",
        });
      }

      return res.status(400).json({
        error:
          error.message ||
          "Image upload failed.",
      });
    }

    if (
      error instanceof Error &&
      error.message.includes(
        "Only JPG"
      )
    ) {
      return res.status(400).json({
        error:
          error.message,
      });
    }

    console.error(
      "Lost-found route error:",
      error
    );

    return res.status(500).json({
      error:
        "An unexpected upload error occurred.",
    });
  }
);

// ============================================
// EXPORT
// ============================================

export default router;