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
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Authentication routes
// Authentication routes
app.use("/api/auth", authRoutes);

// Pet routes
app.use("/api/pets", petRoutes);

app.use("/api/orders", orderRoutes);

// ============================================
// GEMINI AI CLIENT
// ============================================

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return aiClient;
}

// ============================================
// API HEALTH CHECK
// ============================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// AI PET ASSISTANT
// ============================================

app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const {
      prompt,
      petContext,
      language = "en",
    } = req.body;

    const ai = getGeminiClient();

    // Fallback response if Gemini API key is missing
    if (!ai) {
      const isBn = language === "bn";

      return res.json({
        reply: isBn
          ? "FurCare AI সহকারী: আপনার পোষা প্রাণীর যত্ন, খাদ্য ও প্রাথমিক চিকিৎসার বিষয়ে সাহায্য করতে আমি এখানে আছি। (দ্রষ্টব্য: সেরা ফলাফলের জন্য GEMINI_API_KEY সক্রিয় করুন)"
          : "FurCare AI Assistant: I am here to help you with your pet's healthcare, nutrition, and first-aid advice. How can I assist your pet today?",
      });
    }

    const systemInstruction = `
You are "FurCare AI Doctor & Companion", an expert veterinary assistant and friendly pet healthcare advisor for FurCare platform in Bangladesh.

User Language choice:
${language === "bn" ? "Bangla (বাংলা)" : "English"}

If the user language is Bangla, reply in natural, friendly Bangla.
If the user language is English, reply in English.

Provide clear, caring, concise, and accurate advice for dogs, cats, and rabbits.

If the pet might be in critical danger, always advise contacting an emergency veterinarian immediately.

Context about user's pet:
${JSON.stringify(petContext || {})}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply:
        response.text ||
        "Thank you for reaching out to FurCare AI.",
    });
  } catch (error) {
    console.error("Error in AI Assistant route:", error);

    res.status(500).json({
      error: "AI Assistant failed to generate response.",
    });
  }
});

// ============================================
// AI FIRST-AID ADVICE
// ============================================

app.post("/api/gemini/first-aid", async (req, res) => {
  try {
    const {
      symptom,
      petType,
      language = "en",
    } = req.body;

    const ai = getGeminiClient();

    // Fallback response if Gemini API key is missing
    if (!ai) {
      const isBn = language === "bn";

      return res.json({
        firstAidSteps: isBn
          ? [
              "১. আপনার পোষা প্রাণীকে শান্ত এবং নিরিবিলি জায়গায় রাখুন।",
              "২. প্রচুর তাজা জল খেতে দিন (যদি সে পান করতে পারে)।",
              "৩. ডাক্তারের পরামর্শ না পাওয়া পর্যন্ত নিজের থেকে কোনো ওষুধ দেবেন না।",
              "৪. দ্রুত নিকটস্থ পশু চিকিৎসা কেন্দ্রে নিয়ে যান।",
            ]
          : [
              "1. Keep your pet calm and in a comfortable, shaded environment.",
              "2. Offer fresh, clean water if the pet is conscious and able to swallow.",
              "3. Do not give any human medications without vet approval.",
              "4. Prepare your pet for travel to the scheduled vet appointment.",
            ],
      });
    }

    const systemInstruction = `
You are a veterinary emergency specialist.

Provide 3-4 immediate, safe, step-by-step first-aid actions for a ${
      petType || "pet"
    } showing these symptoms:

"${symptom}"

Language:
${language === "bn" ? "Bangla" : "English"}

Return ONLY a JSON array of strings.

Example:
[
  "Step one",
  "Step two",
  "Step three"
]

Do not provide dangerous medication instructions.
If the situation appears life-threatening, recommend contacting an emergency veterinarian immediately.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Provide first-aid steps for symptom: ${symptom}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    let steps: string[] = [];

    try {
      const parsed = JSON.parse(response.text || "[]");

      if (Array.isArray(parsed)) {
        steps = parsed;
      } else {
        steps = [response.text || "Please contact a veterinarian."];
      }
    } catch {
      steps = [
        response.text ||
          "Please contact a veterinarian for proper advice.",
      ];
    }

    res.json({
      firstAidSteps: steps,
    });
  } catch (error) {
    console.error("Error in First Aid route:", error);

    res.status(500).json({
      error: "Failed to generate first-aid steps.",
    });
  }
});

// ============================================
// AI LOST & FOUND PET MATCHER
// ============================================

app.post("/api/gemini/lost-found-match", async (req, res) => {
  try {
    const {
      lostPetData,
      foundListings,
      language = "en",
    } = req.body;

    const ai = getGeminiClient();

    // Make sure foundListings is an array
    const listings = Array.isArray(foundListings)
      ? foundListings
      : [];

    // Fallback matching logic
    if (!ai) {
      const lostBreed =
        lostPetData?.breed?.toLowerCase() || "";

      const lostColor =
        lostPetData?.color?.toLowerCase() || "";

      const matches = listings.filter((item: any) => {
        const itemBreed =
          item.breed?.toLowerCase() || "";

        const itemColor =
          item.color?.toLowerCase() || "";

        return (
          (lostBreed &&
            itemBreed.includes(lostBreed)) ||
          (lostColor &&
            itemColor.includes(lostColor))
        );
      });

      return res.json({
        matchedIds: matches.map(
          (m: any) => m.id
        ),
        analysis:
          language === "bn"
            ? "আমাদের স্মার্ট প্যাটার্ন অ্যালগরিদম দ্বারা সম্ভাব্য রঙের এবং ব্রিডের ম্যাচ খুঁজে পাওয়া গেছে।"
            : "Matched based on color, breed, and physical features pattern analysis.",
      });
    }

    const systemInstruction = `
You are an AI Pet Identification system for lost and found pets in FurCare Bangladesh.

Compare the lost pet details:

${JSON.stringify(lostPetData)}

with candidate found pet listings:

${JSON.stringify(listings)}

Evaluation criteria:

- Color
- Breed
- Face structure
- Eye color
- Collar
- Clothing
- Neck band
- Birthmarks
- Physical characteristics
- Location

Return a JSON object in exactly this format:

{
  "matchedIds": ["id1", "id2"],
  "confidenceScores": {
    "id1": 95,
    "id2": 70
  },
  "analysis": "Brief reasoning"
}

Respond in:
${language === "bn" ? "Bangla" : "English"}

Do not claim that a match is certain. AI matching should be treated as a recommendation for human verification.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        "Perform AI lost pet matching evaluation.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    let result: {
      matchedIds: string[];
      confidenceScores?: Record<string, number>;
      analysis: string;
    } = {
      matchedIds: [],
      confidenceScores: {},
      analysis: "",
    };

    try {
      const parsed = JSON.parse(
        response.text || "{}"
      );

      result = {
        matchedIds: Array.isArray(parsed.matchedIds)
          ? parsed.matchedIds
          : [],

        confidenceScores:
          parsed.confidenceScores || {},

        analysis:
          typeof parsed.analysis === "string"
            ? parsed.analysis
            : "AI evaluated the available listings.",
      };
    } catch {
      result = {
        matchedIds: [],
        confidenceScores: {},
        analysis:
          "AI evaluated the available listings.",
      };
    }

    res.json(result);
  } catch (error) {
    console.error(
      "Error in AI Pet Matcher route:",
      error
    );

    res.status(500).json({
      error: "Failed to match lost pet.",
    });
  }
});

// ============================================
// START EXPRESS + VITE SERVER
// ============================================

async function startServer() {
  try {
    // Connect to MongoDB BEFORE starting the server
    console.log("🔄 Connecting to MongoDB...");

    await connectDatabase();

    console.log("✅ MongoDB connected successfully.");

    // ========================================
    // DEVELOPMENT MODE
    // ========================================

    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

      app.use(vite.middlewares);
    }

    // ========================================
    // PRODUCTION MODE
    // ========================================

    else {
      const distPath = path.join(
        process.cwd(),
        "dist"
      );

      app.use(express.static(distPath));

      app.get("*", (_req, res) => {
        res.sendFile(
          path.join(distPath, "index.html")
        );
      });
    }

    // ========================================
    // START SERVER
    // ========================================

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🐾 FurCare running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start FurCare:",
      error
    );

    process.exit(1);
  }
}

// Start application
startServer(); 
