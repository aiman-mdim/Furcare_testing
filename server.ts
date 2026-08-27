import cookieParser from "cookie-parser";
import { connectDatabase } from "./server/db";
import authRoutes from "./server/routes/auth";
import petRoutes from "./server/routes/pets";
import orderRoutes from "./server/routes/orders";
import lostFoundRoutes from "./server/routes/lostFounds";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://furcare-two.vercel.app",
    ],
    credentials: true,
  })
);
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
// STATIC UPLOADED FILES
// ======================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// ======================================================
// ======================================================
// EXISTING ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/orders", orderRoutes);

// ======================================================
// LOST & FOUND
// ======================================================

app.use("/api/lost-found", lostFoundRoutes);

// ======================================================
// GEMINI
// ======================================================

// ======================================================

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing from .env");
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
// TYPES
// ======================================================

interface ChatHistoryMessage {
  role: "user" | "assistant";
  text: string;
}

interface PetContext {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  ageYears?: number;
  gender?: string;
  weight?: number;
}

// ======================================================
// HELPERS
// ======================================================

function normalizeLanguage(language: unknown): "en" | "bn" {
  return language === "bn" ? "bn" : "en";
}

function getFallbackFirstAid(language: "en" | "bn"): string[] {
  if (language === "bn") {
    return [
      "আপনার পোষা প্রাণীকে শান্ত ও নিরাপদ স্থানে রাখুন।",
      "পোষা প্রাণীটি নিরাপদে পানি পান করতে পারলে পরিষ্কার পানি দিন।",
      "নিজে থেকে মানুষের ওষুধ দেবেন না।",
      "লক্ষণ গুরুতর হলে দ্রুত পশু চিকিৎসকের সাথে যোগাযোগ করুন।",
    ];
  }

  return [
    "Keep your pet calm and in a safe environment.",
    "Offer clean water if your pet can safely drink.",
    "Do not give human medication without veterinary advice.",
    "Contact a veterinarian promptly if symptoms are serious or worsening.",
  ];
}

// ======================================================
// AI DOCTOR SYSTEM PROMPT
// ======================================================

function buildAiDoctorInstruction(
  language: "en" | "bn",
  petContext: PetContext | null
): string {
  const languageRules =
    language === "bn"
      ? `
LANGUAGE RULES:
- Respond entirely in natural Bangla.
- Use simple Bangla that ordinary pet owners in Bangladesh can understand.
- Important veterinary terms may be written in English inside parentheses.
- Do not unnecessarily switch to English.
`
      : `
LANGUAGE RULES:
- Respond entirely in clear natural English.
- Use simple language that ordinary pet owners can understand.
`;

  return `
You are FurCare AI Doctor, a veterinary-care assistant inside the FurCare
pet-care platform.

You help pet owners with:

- pet health questions
- symptoms
- nutrition
- hydration
- behavior
- hygiene
- grooming
- vaccination
- parasite prevention
- preventive care
- basic first aid
- deciding when veterinary care is needed

You are an AI veterinary assistant and NOT a licensed veterinarian.

Never claim that you physically examined the animal.

Never say that a diagnosis is certain based only on a chat.

${languageRules}

==================================================
CURRENT PET INFORMATION
==================================================

${JSON.stringify(petContext || {}, null, 2)}

Use this information when relevant.

Never invent missing pet information.

==================================================
CONVERSATION
==================================================

The user may ask follow-up questions.

For example:

USER:
My cat is not eating.

USER:
Since yesterday.

USER:
She also vomited twice.

Treat these as one continuous conversation.

Use previous messages to understand words such as:

- he
- she
- it
- yesterday
- today
- also
- still
- again
- this problem
- that symptom

Do not repeatedly ask the user for information that they already provided.

==================================================
HOW TO ANSWER
==================================================

For normal pet-care questions:

1. Address the user's concern first.
2. Explain possible causes.
3. Give safe practical steps.
4. Explain what the owner should monitor.
5. Explain when veterinary care is needed.
6. Ask only one or two follow-up questions when necessary.

Keep answers useful and easy to understand.

==================================================
DIAGNOSIS
==================================================

Never say:

"Your pet definitely has X."

Instead say:

"Possible causes include..."
"This can happen with..."
"One possibility is..."

Explain that an examination may be necessary.

==================================================
MEDICATION SAFETY
==================================================

Never recommend human medication as automatically safe for animals.

Never invent medication doses.

Never provide dangerous medication instructions.

If medication is relevant, tell the owner to consult a qualified veterinarian
for the correct medication and dosage.

==================================================
URGENT WARNING SIGNS
==================================================

Treat these as potentially urgent:

- difficulty breathing
- collapse
- unconsciousness
- severe bleeding
- repeated seizures
- suspected poisoning
- major trauma
- inability to urinate
- severe weakness
- pale, blue or grey gums
- severe persistent vomiting
- severe persistent diarrhea with weakness
- inability to keep water down
- serious eye injury
- severe heat-related symptoms
- rapidly worsening condition

For potentially urgent cases:

1. Clearly explain that urgent veterinary attention may be required.
2. Give only safe immediate supportive guidance.
3. Tell the owner to contact a veterinarian promptly.
4. Do not provide risky home-treatment instructions.

==================================================
STYLE
==================================================

Be:

- caring
- calm
- professional
- practical
- concise
- easy to understand

Use short paragraphs and bullet points.

Answer the user's actual question first.

If the question is unrelated to pets, politely explain that FurCare AI Doctor
is designed primarily for pet-care assistance.

==================================================
BANGLADESH
==================================================

FurCare is designed for pet owners in Bangladesh.

When professional care is needed, recommend contacting a qualified local
veterinarian or veterinary clinic.

Never invent clinic names or telephone numbers.

==================================================
FINAL SAFETY RULE
==================================================

You provide general veterinary information and guidance.

You do not replace a professional veterinary examination.
`;
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (_req, res) => {
  res.json({
    name: "FurCare API",
    status: "running",
    health: "/api/health",
  });
});

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
// AI DOCTOR CHAT
// ======================================================

app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const {
      prompt,
      petContext = null,
      language = "en",
      history = [],
    } = req.body as {
      prompt?: string;
      petContext?: PetContext | null;
      language?: string;
      history?: ChatHistoryMessage[];
    };

    const userPrompt =
      typeof prompt === "string" ? prompt.trim() : "";

    if (!userPrompt) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const selectedLanguage = normalizeLanguage(language);

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error:
          selectedLanguage === "bn"
            ? "Gemini AI কনফিগার করা হয়নি। .env ফাইলে GEMINI_API_KEY সেট করুন।"
            : "Gemini AI is not configured. Please set GEMINI_API_KEY in your .env file.",
      });
    }

    // ==================================================
    // CLEAN HISTORY
    // ==================================================

    const safeHistory: ChatHistoryMessage[] =
      Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === "user" ||
                  item.role === "assistant") &&
                typeof item.text === "string" &&
                item.text.trim().length > 0
            )
            .slice(-12)
            .map((item) => ({
              role: item.role,
              text: item.text.trim(),
            }))
        : [];

    // ==================================================
    // SYSTEM INSTRUCTION
    // ==================================================

    const systemInstruction = buildAiDoctorInstruction(
      selectedLanguage,
      petContext
    );

    // ==================================================
    // CONVERSATION
    // ==================================================

    let conversation = "";

    if (safeHistory.length > 0) {
      conversation += `
PREVIOUS CONVERSATION:

`;

      conversation += safeHistory
        .map((message) => {
          const speaker =
            message.role === "user"
              ? "USER"
              : "FURCARE AI DOCTOR";

          return `${speaker}: ${message.text}`;
        })
        .join("\n\n");

      conversation += `

==================================================

CURRENT USER QUESTION:

${userPrompt}
`;
    } else {
      conversation = `
CURRENT USER QUESTION:

${userPrompt}
`;
    }

    // ==================================================
    // GEMINI REQUEST
    // ==================================================

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: conversation,

      config: {
        systemInstruction,
        temperature: 0.35,
        maxOutputTokens: 1200,
      },
    });

    const reply =
      typeof response.text === "string"
        ? response.text.trim()
        : "";

    if (!reply) {
      return res.status(502).json({
        error:
          selectedLanguage === "bn"
            ? "AI Doctor কোনো উত্তর দিতে পারেনি। আবার চেষ্টা করুন।"
            : "The AI Doctor did not return an answer. Please try again.",
      });
    }

    console.log("🩺 AI Doctor response generated");

    return res.json({
      reply,
      language: selectedLanguage,
    });
  } catch (error: unknown) {
    console.error("❌ FurCare AI Doctor error:", error);

    const language = normalizeLanguage(req.body?.language);

    return res.status(500).json({
      error:
        language === "bn"
          ? "দুঃখিত, AI Doctor এই মুহূর্তে উত্তর তৈরি করতে পারেনি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          : "Sorry, the AI Doctor could not generate a response right now. Please try again.",
    });
  }
});

// ======================================================
// FIRST AID
// ======================================================

app.post("/api/gemini/first-aid", async (req, res) => {
  try {
    const {
      symptom,
      petType,
      language = "en",
    } = req.body;

    const selectedLanguage = normalizeLanguage(language);

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        firstAidSteps: getFallbackFirstAid(selectedLanguage),
      });
    }

    const systemInstruction = `
You are FurCare's veterinary first-aid assistant.

Pet:
${petType || "unknown pet"}

Symptoms:
${symptom || "unknown"}

Language:
${selectedLanguage === "bn" ? "Bangla" : "English"}

Give 3-4 safe first-aid steps.

Rules:

- Do not recommend dangerous procedures.
- Do not recommend human medication.
- Do not invent medication doses.
- If the situation may be an emergency, tell the owner to contact a
  veterinarian urgently.
- Keep the answer practical and concise.

Return ONLY a JSON array of strings.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: "Provide safe first-aid guidance.",

      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let steps: string[] = [];

    try {
      const parsed = JSON.parse(response.text || "[]");

      if (Array.isArray(parsed)) {
        steps = parsed
          .filter((item) => typeof item === "string")
          .slice(0, 5);
      }
    } catch {
      steps = [];
    }

    if (steps.length === 0) {
      steps = getFallbackFirstAid(selectedLanguage);
    }

    return res.json({
      firstAidSteps: steps,
    });
  } catch (error) {
    console.error("❌ First aid error:", error);

    return res.status(500).json({
      error: "Failed to generate first-aid advice.",
    });
  }
});

// ======================================================
// LOST AND FOUND MATCHING
// ======================================================

app.post("/api/gemini/lost-found-match", async (req, res) => {
  try {
    const {
      lostPetData,
      foundListings,
      language = "en",
    } = req.body;

    const listings = Array.isArray(foundListings)
      ? foundListings
      : [];

    const selectedLanguage = normalizeLanguage(language);

    const ai = getGeminiClient();

    if (!ai) {
      const lostBreed =
        lostPetData?.breed?.toLowerCase() || "";

      const lostColor =
        lostPetData?.color?.toLowerCase() || "";

      const matches = listings.filter((item: any) => {
        const breed = item.breed?.toLowerCase() || "";
        const color = item.color?.toLowerCase() || "";

        return (
          (lostBreed && breed.includes(lostBreed)) ||
          (lostColor && color.includes(lostColor))
        );
      });

      return res.json({
        matchedIds: matches.map((item: any) => item.id),
        confidenceScores: {},
        analysis:
          selectedLanguage === "bn"
            ? "Gemini AI কনফিগার করা না থাকায় সাধারণ তথ্যের ভিত্তিতে matching করা হয়েছে।"
            : "Fallback matching was used because Gemini is not configured.",
      });
    }

    const systemInstruction = `
You are FurCare's lost-and-found pet matching assistant.

Compare the lost pet information with the found pet listings.

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

Never claim that a match is certain.

Language:
${selectedLanguage === "bn" ? "Bangla" : "English"}

Return ONLY valid JSON:

{
  "matchedIds": [],
  "confidenceScores": {},
  "analysis": ""
}

Lost pet:

${JSON.stringify(lostPetData, null, 2)}

Found listings:

${JSON.stringify(listings, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents:
        "Analyze the possible lost-and-found matches.",

      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let result: any = {
      matchedIds: [],
      confidenceScores: {},
      analysis:
        selectedLanguage === "bn"
          ? "কোনো শক্তিশালী match পাওয়া যায়নি।"
          : "No strong match was found.",
    };

    try {
      const parsed = JSON.parse(response.text || "{}");

      result = {
        matchedIds: Array.isArray(parsed.matchedIds)
          ? parsed.matchedIds
          : [],

        confidenceScores:
          parsed.confidenceScores || {},

        analysis:
          typeof parsed.analysis === "string"
            ? parsed.analysis
            : result.analysis,
      };
    } catch {
      console.warn(
        "⚠️ Could not parse lost-found AI response."
      );
    }

    return res.json(result);
  } catch (error) {
    console.error(
      "❌ Lost-found matcher error:",
      error
    );

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Lost-and-found AI matching failed.",
    });
  }
});

// ======================================================
// FIND MY PET IMAGE MATCHING
// ======================================================

app.post("/api/gemini/find-pet-matches", async (req, res) => {
  try {
    console.log(
      "🐾 Received Find My Pet image request"
    );

    const {
      imageBase64,
      mimeType,
      language = "en",
    } = req.body;

    const selectedLanguage = normalizeLanguage(language);

    if (!imageBase64) {
      return res.status(400).json({
        error:
          selectedLanguage === "bn"
            ? "কোনো pet image পাওয়া যায়নি।"
            : "No pet image was received.",
      });
    }

    if (!mimeType) {
      return res.status(400).json({
        error:
          selectedLanguage === "bn"
            ? "Image type দেওয়া হয়নি।"
            : "Image type was not provided.",
      });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({
        error:
          "Only JPG, PNG and WEBP images are supported.",
      });
    }

    const estimatedBytes =
      (imageBase64.length * 3) / 4;

    if (estimatedBytes > 10 * 1024 * 1024) {
      return res.status(400).json({
        error:
          "The image is too large. Please upload an image smaller than 10 MB.",
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error:
          "Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file.",
      });
    }

    const { mockLostFound } =
      await import("./src/data/mockData");

    const foundListings = mockLostFound.filter(
      (item: any) => item.type === "found"
    );

    const listingSummary = foundListings.map(
      (item: any) => ({
        id: item.id,
        petName: item.petName,
        species: item.species,
        breed: item.breed,
        color: item.color,
        eyeColor: item.eyeColor,
        faceStructure: item.faceStructure,
        collarNeckband: item.collarNeckband,
        birthmarkOrFeature:
          item.birthmarkOrFeature,
        lastWearCloth: item.lastWearCloth,
        lastLocation: item.lastLocation,
        photoUrl: item.photoUrl,
      })
    );

    const prompt = `
You are FurCare's AI Lost Pet Identification system.

Analyze the uploaded photograph.

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

Compare the uploaded pet against these FOUND listings:

${JSON.stringify(listingSummary, null, 2)}

Return ONLY valid JSON:

{
  "matches": [
    {
      "listingId": "FOUND-ID",
      "confidence": 85,
      "reason": "Short explanation."
    }
  ],
  "analysis": "Short overall analysis."
}

Rules:

1. Only include plausible matches.
2. Confidence must be between 0 and 100.
3. Never claim a match is certain.
4. If no plausible match exists, return an empty matches array.
5. Never invent listing IDs.
6. Only use IDs from the provided listings.

Language:
${selectedLanguage === "bn" ? "Bangla" : "English"}
`;

    console.log(
      `🔎 Comparing against ${foundListings.length} found pet listings...`
    );

    const response = await ai.models.generateContent({
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
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const rawText = response.text || "{}";

    let parsed: any;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error(
        "❌ Invalid Gemini image JSON:",
        rawText
      );

      return res.status(500).json({
        error:
          "AI returned an invalid response. Please try another image.",
      });
    }

    const rawMatches = Array.isArray(parsed.matches)
      ? parsed.matches
      : [];

    const matches = rawMatches
      .map((match: any) => {
        const listing = foundListings.find(
          (item: any) =>
            item.id === match.listingId
        );

        if (!listing) {
          return null;
        }

        const confidence = Math.max(
          0,
          Math.min(
            100,
            Number(match.confidence) || 0
          )
        );

        return {
          listingId: listing.id,
          confidence,

          reason:
            typeof match.reason === "string"
              ? match.reason
              : "AI identified similarities between the uploaded image and this listing.",

          listing,
        };
      })
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          b.confidence - a.confidence
      );

    return res.json({
      matches,

      analysis:
        typeof parsed.analysis === "string"
          ? parsed.analysis
          : selectedLanguage === "bn"
          ? "AI pet comparison সম্পন্ন হয়েছে।"
          : "AI completed the pet comparison.",
    });
  } catch (error) {
    console.error(
      "❌ FIND MY PET ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error occurred while searching for your pet.",
    });
  }
});

// ======================================================
// API 404
// ======================================================

app.use("/api", (_req, res) => {
  res.status(404).json({
    error: "API endpoint not found.",
  });
});

// ======================================================
// START SERVER
// ======================================================

async function startServer() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await connectDatabase();

    console.log(
      "✅ MongoDB connected successfully."
    );

    // ==================================================
    // VITE DEVELOPMENT
    // ==================================================

    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

      app.use(vite.middlewares);
    }

    // ==================================================
    // PRODUCTION
    // ==================================================

    if (process.env.NODE_ENV === "production") {
      const distPath = path.join(
        process.cwd(),
        "dist"
      );

      app.use(express.static(distPath));

      app.get("*", (_req, res) => {
        res.sendFile(
          path.join(
            distPath,
            "index.html"
          )
        );
      });
    }

    // ==================================================
    // SERVER
    // ==================================================

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🐾 FurCare running at http://localhost:${PORT}`
        );

        console.log(
          `🩺 AI Doctor: ${
            process.env.GEMINI_API_KEY
              ? "CONFIGURED"
              : "NOT CONFIGURED"
          }`
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
