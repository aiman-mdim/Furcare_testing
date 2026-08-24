import cookieParser from "cookie-parser";
import { connectDatabase } from "./server/db";
import authRoutes from "./server/routes/auth";
import petRoutes from "./server/routes/pets";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import orderRoutes from "./server/routes/orders";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cookieParser());

app.use(
  express.json({
    limit: "15mb",
  })
);

// ======================================================
// EXISTING ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/pets", petRoutes);

<<<<<<< HEAD
// ======================================================
// GEMINI CLIENT
// ======================================================
=======
app.use("/api/orders", orderRoutes);

// ============================================
// GEMINI AI CLIENT
// ============================================
>>>>>>> origin/main

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️ GEMINI_API_KEY is missing from .env"
    );

    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return aiClient;
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY
    ),
  });
});

// ======================================================
// GEMINI ASSISTANT
// ======================================================

app.post(
  "/api/gemini/assistant",
  async (req, res) => {
    try {
      const {
        prompt,
        petContext,
        language = "en",
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        const isBn = language === "bn";

        return res.json({
          reply: isBn
            ? "FurCare AI সহকারী: আপনার পোষা প্রাণীর যত্ন, খাদ্য ও প্রাথমিক চিকিৎসা সম্পর্কে সাহায্য করতে আমি এখানে আছি।"
            : "FurCare AI Assistant: I am here to help you with your pet's healthcare, nutrition, and first-aid advice.",
        });
      }

      const systemInstruction = `
You are FurCare AI Doctor & Companion.

You are a veterinary assistant for the FurCare platform in Bangladesh.

User language:
${
  language === "bn"
    ? "Bangla"
    : "English"
}

Provide clear, caring and concise pet-care information.

Pet context:
${JSON.stringify(petContext || {})}

If the situation appears serious, recommend contacting a qualified veterinarian.
`;

      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt || "",
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

      res.json({
        reply:
          response.text ||
          "Thank you for contacting FurCare AI.",
      });
    } catch (error) {
      console.error(
        "❌ AI Assistant error:",
        error
      );

      res.status(500).json({
        error:
          "AI Assistant failed to generate a response.",
      });
    }
  }
);

// ======================================================
// FIRST AID
// ======================================================

app.post(
  "/api/gemini/first-aid",
  async (req, res) => {
    try {
      const {
        symptom,
        petType,
        language = "en",
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          firstAidSteps:
            language === "bn"
              ? [
                  "আপনার পোষা প্রাণীকে শান্ত ও নিরাপদ স্থানে রাখুন।",
                  "যদি নিরাপদে পান করতে পারে, পরিষ্কার পানি দিন।",
                  "নিজে থেকে মানুষের ওষুধ দেবেন না।",
                  "প্রয়োজনে পশু চিকিৎসকের পরামর্শ নিন।",
                ]
              : [
                  "Keep your pet calm and in a safe environment.",
                  "Offer clean water if the pet can safely drink.",
                  "Do not give human medication without veterinary advice.",
                  "Contact a veterinarian if symptoms continue or worsen.",
                ],
        });
      }

      const systemInstruction = `
You are a veterinary first-aid assistant.

Pet:
${petType || "pet"}

Symptoms:
${symptom || "unknown"}

Language:
${language === "bn" ? "Bangla" : "English"}

Return 3-4 safe first-aid steps as a JSON array.

Do not provide dangerous medication instructions.
`;

      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents:
            "Provide safe first-aid guidance.",
          config: {
            systemInstruction,
            responseMimeType:
              "application/json",
          },
        });

      let steps: string[] = [];

      try {
        const parsed = JSON.parse(
          response.text || "[]"
        );

        if (Array.isArray(parsed)) {
          steps = parsed;
        }
      } catch {
        steps = [
          response.text ||
            "Please contact a veterinarian.",
        ];
      }

      res.json({
        firstAidSteps: steps,
      });
    } catch (error) {
      console.error(
        "❌ First aid error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to generate first-aid advice.",
      });
    }
  }
);

// ======================================================
// AI LOST & FOUND MATCHER
// ======================================================

app.post(
  "/api/gemini/lost-found-match",
  async (req, res) => {
    try {
      const {
        lostPetData,
        foundListings,
        language = "en",
      } = req.body;

      const listings = Array.isArray(
        foundListings
      )
        ? foundListings
        : [];

      const ai = getGeminiClient();

      // --------------------------------------------------
      // FALLBACK WHEN GEMINI IS NOT CONFIGURED
      // --------------------------------------------------

      if (!ai) {
        const lostBreed =
          lostPetData?.breed
            ?.toLowerCase() || "";

        const lostColor =
          lostPetData?.color
            ?.toLowerCase() || "";

        const matches = listings.filter(
          (item: any) => {
            const breed =
              item.breed
                ?.toLowerCase() || "";

            const color =
              item.color
                ?.toLowerCase() || "";

            return (
              (lostBreed &&
                breed.includes(
                  lostBreed
                )) ||
              (lostColor &&
                color.includes(
                  lostColor
                ))
            );
          }
        );

        return res.json({
          matchedIds: matches.map(
            (item: any) => item.id
          ),
          analysis:
            "Fallback matching was used because Gemini is not configured.",
        });
      }

      // --------------------------------------------------
      // GEMINI TEXT MATCHING
      // --------------------------------------------------

      const systemInstruction = `
You are FurCare's lost-and-found pet matching assistant.

Compare the lost pet information against found pet listings.

Consider:

- species
- breed
- color
- eye color
- face structure
- collar
- neckband
- clothing
- distinctive features
- location

Return JSON:

{
  "matchedIds": [],
  "confidenceScores": {},
  "analysis": ""
}

Never claim a match is certain.

Language:
${
  language === "bn"
    ? "Bangla"
    : "English"
}

Lost pet:
${JSON.stringify(lostPetData)}

Found listings:
${JSON.stringify(listings)}
`;

      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents:
            "Analyze the possible lost-and-found matches.",
          config: {
            systemInstruction,
            responseMimeType:
              "application/json",
          },
        });

      let result: any = {
        matchedIds: [],
        confidenceScores: {},
        analysis:
          "No strong match was found.",
      };

      try {
        const parsed = JSON.parse(
          response.text || "{}"
        );

        result = {
          matchedIds:
            Array.isArray(
              parsed.matchedIds
            )
              ? parsed.matchedIds
              : [],

          confidenceScores:
            parsed.confidenceScores ||
            {},

          analysis:
            typeof parsed.analysis ===
            "string"
              ? parsed.analysis
              : "AI evaluated the available listings.",
        };
      } catch {
        console.warn(
          "⚠️ Could not parse Gemini matcher response."
        );
      }

      res.json(result);
    } catch (error) {
      console.error(
        "❌ Lost-found matcher error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Lost-and-found AI matching failed.",
      });
    }
  }
);

// ======================================================
// NEW: AI IMAGE SEARCH
// ======================================================

app.post(
  "/api/gemini/find-pet-matches",
  async (req, res) => {
    try {
      console.log(
        "🐾 Received Find My Pet image request"
      );

      const {
        imageBase64,
        mimeType,
      } = req.body;

      // --------------------------------------------------
      // VALIDATION
      // --------------------------------------------------

      if (!imageBase64) {
        return res.status(400).json({
          error:
            "No pet image was received.",
        });
      }

      if (!mimeType) {
        return res.status(400).json({
          error:
            "Image type was not provided.",
        });
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(mimeType)
      ) {
        return res.status(400).json({
          error:
            "Only JPG, PNG and WEBP images are supported.",
        });
      }

      // --------------------------------------------------
      // LIMIT IMAGE SIZE
      // --------------------------------------------------

      const estimatedBytes =
        (imageBase64.length * 3) / 4;

      if (
        estimatedBytes >
        10 * 1024 * 1024
      ) {
        return res.status(400).json({
          error:
            "The image is too large. Please upload an image smaller than 10 MB.",
        });
      }

      // --------------------------------------------------
      // GEMINI
      // --------------------------------------------------

      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          error:
            "Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file and restart the server.",
        });
      }

      // --------------------------------------------------
      // GET FOUND PETS
      // --------------------------------------------------

      const { mockLostFound } =
        await import(
          "./src/data/mockData"
        );

      const foundListings =
        mockLostFound.filter(
          (item: any) =>
            item.type === "found"
        );

      // --------------------------------------------------
      // AI PROMPT
      // --------------------------------------------------

      const listingSummary =
        foundListings.map(
          (item: any) => ({
            id: item.id,
            petName: item.petName,
            species: item.species,
            breed: item.breed,
            color: item.color,
            eyeColor:
              item.eyeColor,
            faceStructure:
              item.faceStructure,
            collarNeckband:
              item.collarNeckband,
            birthmarkOrFeature:
              item.birthmarkOrFeature,
            lastWearCloth:
              item.lastWearCloth,
            lastLocation:
              item.lastLocation,
            photoUrl:
              item.photoUrl,
          })
        );

      const prompt = `
You are FurCare's AI Lost Pet Identification system.

The user uploaded a photograph of their lost pet.

Analyze the uploaded image carefully.

Identify visible characteristics such as:

- species
- approximate breed/type
- coat color
- coat pattern
- face shape
- ears
- eyes
- distinctive markings
- collar or neckband
- other visible identifying features

Then compare those characteristics with these FOUND pet listings:

${JSON.stringify(
  listingSummary,
  null,
  2
)}

Return ONLY valid JSON in exactly this format:

{
  "matches": [
    {
      "listingId": "FOUND-ID",
      "confidence": 85,
      "reason": "Short explanation of why the pet may match."
    }
  ],
  "analysis": "Short overall analysis."
}

Rules:

1. Only include plausible matches.
2. Confidence must be between 0 and 100.
3. Do not claim certainty.
4. If there are no plausible matches, return an empty matches array.
5. Do not invent listing IDs.
6. Compare the uploaded image with the listing information carefully.
`;

      console.log(
        `🔎 Comparing against ${foundListings.length} found pet listings...`
      );

      // --------------------------------------------------
      // SEND IMAGE + PROMPT TO GEMINI
      // --------------------------------------------------

      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          config: {
            responseMimeType:
              "application/json",
            temperature: 0.2,
          },
        });

      // --------------------------------------------------
      // PARSE RESULT
      // --------------------------------------------------

      const rawText =
        response.text || "{}";

      console.log(
        "🤖 Gemini response received."
      );

      let parsed: any;

      try {
        parsed = JSON.parse(
          rawText
        );
      } catch (parseError) {
        console.error(
          "❌ Gemini JSON parse error:",
          rawText
        );

        return res.status(500).json({
          error:
            "AI returned an invalid response. Please try another image.",
        });
      }

      const rawMatches =
        Array.isArray(
          parsed.matches
        )
          ? parsed.matches
          : [];

      // --------------------------------------------------
      // JOIN AI RESULTS WITH ACTUAL LISTINGS
      // --------------------------------------------------

      const matches =
        rawMatches
          .map((match: any) => {
            const listing =
              foundListings.find(
                (item: any) =>
                  item.id ===
                  match.listingId
              );

            if (!listing) {
              return null;
            }

            const confidence =
              Math.max(
                0,
                Math.min(
                  100,
                  Number(
                    match.confidence
                  ) || 0
                )
              );

            return {
              listingId:
                listing.id,

              confidence,

              reason:
                typeof match.reason ===
                "string"
                  ? match.reason
                  : "The AI identified similarities in the available pet information.",

              listing,
            };
          })
          .filter(Boolean)
          .sort(
            (a: any, b: any) =>
              b.confidence -
              a.confidence
          );

      res.json({
        matches,
        analysis:
          typeof parsed.analysis ===
          "string"
            ? parsed.analysis
            : "AI completed the pet comparison.",
      });
    } catch (error) {
      console.error(
        "❌ FIND MY PET ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error occurred while searching for your pet.";

      res.status(500).json({
        error: message,
      });
    }
  }
);

// ======================================================
// START SERVER
// ======================================================

async function startServer() {
  try {
    console.log(
      "🔄 Connecting to MongoDB..."
    );

    await connectDatabase();

    console.log(
      "✅ MongoDB connected successfully."
    );

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      const vite =
        await createViteServer({
          server: {
            middlewareMode: true,
          },

          appType: "spa",
        });

      app.use(
        vite.middlewares
      );
    } else {
      const distPath =
        path.join(
          process.cwd(),
          "dist"
        );

      app.use(
        express.static(distPath)
      );

      app.get(
        "*",
        (_req, res) => {
          res.sendFile(
            path.join(
              distPath,
              "index.html"
            )
          );
        }
      );
    }

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🐾 FurCare running at http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ Failed to start FurCare:",
      error
    );

    process.exit(1);
  }
}

startServer();