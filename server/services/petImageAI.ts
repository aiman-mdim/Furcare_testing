import "dotenv/config";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// GEMINI CONFIGURATION
// ============================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "GEMINI_API_KEY is not configured. AI pet recognition will not work."
  );
}

const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

// ============================================
// TYPES
// ============================================

export interface PetImageAnalysis {
  species?: string;
  breed?: string;
  color?: string;
  markings?: string[];
  facialFeatures?: string[];
  distinctiveFeatures?: string[];
}

export interface PetMatchResult {
  listingId: string;
  confidence: number;
  reason: string;
}

// Candidate supplied by lostFounds.ts
export interface PetImageCandidate {
  listingId: string;
  imagePath: string;
  species?: string;
  breed?: string;
  color?: string;
}

// ============================================
// GEMINI MODEL
// ============================================

function getModel() {
  if (!genAI) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server."
    );
  }

  return genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });
}

// ============================================
// MIME TYPE
// ============================================

function getMimeType(filePath: string): string {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".png":
      return "image/png";

    case ".webp":
      return "image/webp";

    case ".gif":
      return "image/gif";

    default:
      return "image/jpeg";
  }
}

// ============================================
// READ IMAGE
// ============================================

function readImage(filePath: string) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Image file does not exist: ${absolutePath}`
    );
  }

  const stats = fs.statSync(absolutePath);

  if (!stats.isFile()) {
    throw new Error(
      `Image path is not a file: ${absolutePath}`
    );
  }

  const buffer = fs.readFileSync(
    absolutePath
  );

  if (!buffer.length) {
    throw new Error(
      `Image file is empty: ${absolutePath}`
    );
  }

  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: getMimeType(
        absolutePath
      ),
    },
  };
}

// ============================================
// ANALYZE PET IMAGE
// ============================================
//
// Used when a lost/found listing is created.
//
// The result is stored in MongoDB as:
//
// imageFeatures: {
//   species,
//   breed,
//   color,
//   markings,
//   facialFeatures,
//   distinctiveFeatures
// }
//
// ============================================

export async function analyzePetImage(
  imagePath: string
): Promise<PetImageAnalysis> {
  const model = getModel();

  const image = readImage(
    imagePath
  );

  const prompt = `
You are an AI pet image analysis system for a lost-and-found pet application.

Analyze the animal in the provided photograph.

Your task is to identify ONLY visible characteristics.

IMPORTANT:
- Do not claim that you can prove the animal's identity.
- Do not claim certainty.
- Do not identify the owner.
- Do not infer information that cannot be visually observed.
- If a characteristic cannot be determined, return an empty string or empty array.
- Focus on characteristics useful for comparing the same pet across photographs.

Analyze:

1. Species:
   - dog
   - cat
   - rabbit
   - or another animal if clearly visible

2. Likely breed.

3. Overall coat/fur color.

4. Visible markings:
   - spots
   - stripes
   - patches
   - color patterns
   - unusual coat patterns

5. Facial features:
   - face shape
   - muzzle shape
   - ear shape
   - visible eye characteristics
   - facial markings

6. Distinctive visible features:
   - unique patches
   - unusual markings
   - visible scars
   - unusual fur patterns
   - distinctive ears
   - distinctive facial characteristics
   - other visually useful identifying characteristics

Return ONLY valid JSON.

Use exactly this structure:

{
  "species": "",
  "breed": "",
  "color": "",
  "markings": [],
  "facialFeatures": [],
  "distinctiveFeatures": []
}

Do not include markdown.
Do not include explanations outside the JSON.
`;

  const result =
    await model.generateContent([
      prompt,
      image,
    ]);

  const text =
    result.response.text();

  const parsed =
    parseJsonResponse<PetImageAnalysis>(
      text
    );

  return normalizePetAnalysis(
    parsed
  );
}

// ============================================
// MATCH LOST PET AGAINST FOUND PETS
// ============================================
//
// First image:
// LOST PET
//
// Remaining images:
// FOUND PET candidates
//
// Returns:
//
// [
//   {
//     listingId,
//     confidence,
//     reason
//   }
// ]
//
// ============================================

export async function matchPetImages(
  lostImagePath: string,
  candidates: PetImageCandidate[]
): Promise<PetMatchResult[]> {
  if (!candidates.length) {
    return [];
  }

  const model = getModel();

  // ------------------------------------------
  // READ LOST IMAGE
  // ------------------------------------------

  const lostImage =
    readImage(
      lostImagePath
    );

  // ------------------------------------------
  // REMOVE INVALID / DUPLICATE CANDIDATES
  // ------------------------------------------

  const uniqueCandidates: PetImageCandidate[] =
    [];

  const seenIds =
    new Set<string>();

  for (const candidate of candidates) {
    if (
      !candidate ||
      !candidate.listingId ||
      !candidate.imagePath
    ) {
      continue;
    }

    const listingId =
      String(
        candidate.listingId
      );

    if (
      seenIds.has(listingId)
    ) {
      continue;
    }

    seenIds.add(listingId);

    uniqueCandidates.push({
      ...candidate,
      listingId,
    });
  }

  if (
    !uniqueCandidates.length
  ) {
    return [];
  }

  // ------------------------------------------
  // LIMIT NUMBER OF IMAGES
  // ------------------------------------------
  //
  // This prevents an unlimited number of
  // images being sent to Gemini.
  //
  // Your route currently retrieves up to 20.
  //
  // ------------------------------------------

  const limitedCandidates =
    uniqueCandidates.slice(
      0,
      20
    );

  // ------------------------------------------
  // BUILD GEMINI REQUEST
  // ------------------------------------------

  const promptParts: any[] =
    [];

  promptParts.push(`
You are an AI visual comparison assistant for a lost-and-found pet application.

The first image provided is the LOST PET.

The remaining images are FOUND PET candidates.

Your job is to compare the LOST PET against EVERY FOUND PET candidate.

This is a visual similarity system.

It is NOT guaranteed identity verification.

IMPORTANT RULES:

1. Compare each candidate independently with the lost pet.

2. Consider:
   - species
   - overall body appearance
   - breed characteristics
   - coat color
   - coat pattern
   - spots
   - stripes
   - patches
   - facial markings
   - ear shape
   - muzzle shape
   - eye appearance
   - face structure
   - distinctive visible features

3. Give greater importance to distinctive markings than generic characteristics.

4. A generic characteristic such as:
   "brown dog"
   or
   "black cat"
   should NOT by itself produce a high confidence score.

5. Matching breed alone is NOT enough.

6. Matching color alone is NOT enough.

7. Compare actual visible markings and facial characteristics whenever possible.

8. Ignore collars, clothing and accessories if they are different between photographs.

9. Account for differences caused by:
   - camera angle
   - lighting
   - distance
   - image quality
   - pose

10. Do not assume two animals are identical merely because they look similar.

11. If the photographs do not provide enough information, use a conservative confidence score.

12. Never claim certainty.

CONFIDENCE GUIDELINE:

0-20:
Very poor visual similarity.

21-40:
Weak similarity.

41-60:
Moderate similarity.

61-75:
Good similarity.

76-90:
Strong visual similarity.

91-100:
Extremely strong visual similarity based on multiple distinctive visible characteristics.

Do NOT use 100 unless the photographs show exceptionally strong matching visual characteristics.

Return EVERY candidate.

Sort candidates from highest confidence to lowest confidence.

Return ONLY valid JSON.

Required format:

{
  "matches": [
    {
      "listingId": "candidate-id",
      "confidence": 0,
      "reason": "short explanation of the visible similarities and differences"
    }
  ]
}

Do not include markdown.
Do not include text outside the JSON.
`);

  // ------------------------------------------
  // LOST PET IMAGE
  // ------------------------------------------

  promptParts.push(
    "\n\n========== LOST PET IMAGE ==========\n"
  );

  promptParts.push(
    lostImage
  );

  // ------------------------------------------
  // FOUND PET IMAGES
  // ------------------------------------------

  const validCandidateIds =
    new Set<string>();

  for (
    const candidate of limitedCandidates
  ) {
    validCandidateIds.add(
      candidate.listingId
    );

    promptParts.push(`
    
========== FOUND PET CANDIDATE ==========

Candidate listing ID:
${candidate.listingId}

Known listing information:

Species:
${candidate.species || "unknown"}

Breed:
${candidate.breed || "unknown"}

Color:
${candidate.color || "unknown"}

Now compare this candidate's photograph against the LOST PET photograph.
`);

    try {
      const candidateImage =
        readImage(
          candidate.imagePath
        );

      promptParts.push(
        candidateImage
      );
    } catch (error) {
      console.error(
        `Could not read candidate image ${candidate.listingId}:`,
        error
      );
    }
  }

  // ------------------------------------------
  // CALL GEMINI
  // ------------------------------------------

  const result =
    await model.generateContent(
      promptParts
    );

  const text =
    result.response.text();

  // ------------------------------------------
  // PARSE RESPONSE
  // ------------------------------------------

  const parsed =
    parseJsonResponse<{
      matches: PetMatchResult[];
    }>(
      text
    );

  if (
    !parsed ||
    !Array.isArray(
      parsed.matches
    )
  ) {
    return [];
  }

  // ------------------------------------------
  // VALIDATE RESULTS
  // ------------------------------------------

  const results: PetMatchResult[] =
    [];

  const returnedIds =
    new Set<string>();

  for (
    const match of parsed.matches
  ) {
    if (
      !match ||
      typeof match.listingId !==
        "string"
    ) {
      continue;
    }

    const listingId =
      String(
        match.listingId
      );

    // Gemini must only return actual
    // candidates that we supplied.
    if (
      !validCandidateIds.has(
        listingId
      )
    ) {
      continue;
    }

    // Prevent duplicate results.
    if (
      returnedIds.has(
        listingId
      )
    ) {
      continue;
    }

    returnedIds.add(
      listingId
    );

    let confidence =
      Number(
        match.confidence
      );

    if (
      !Number.isFinite(
        confidence
      )
    ) {
      confidence = 0;
    }

    confidence =
      Math.max(
        0,
        Math.min(
          100,
          confidence
        )
      );

    const reason =
      typeof match.reason ===
      "string"
        ? match.reason.trim()
        : "";

    results.push({
      listingId,
      confidence,
      reason,
    });
  }

  // ------------------------------------------
  // MAKE SURE EVERY VALID CANDIDATE APPEARS
  // ------------------------------------------
  //
  // Gemini can occasionally omit an image.
  //
  // We add omitted candidates with confidence 0
  // so the API contract remains predictable.
  //
  // ------------------------------------------

  for (
    const candidate of limitedCandidates
  ) {
    if (
      !returnedIds.has(
        candidate.listingId
      )
    ) {
      results.push({
        listingId:
          candidate.listingId,

        confidence: 0,

        reason:
          "No reliable visual similarity could be determined.",
      });
    }
  }

  // ------------------------------------------
  // SORT
  // ------------------------------------------

  results.sort(
    (a, b) =>
      b.confidence -
      a.confidence
  );

  return results;
}

// ============================================
// NORMALIZE PET ANALYSIS
// ============================================

function normalizePetAnalysis(
  analysis: PetImageAnalysis
): PetImageAnalysis {
  if (
    !analysis ||
    typeof analysis !==
      "object"
  ) {
    return {
      species: "",
      breed: "",
      color: "",
      markings: [],
      facialFeatures: [],
      distinctiveFeatures: [],
    };
  }

  return {
    species:
      typeof analysis.species ===
      "string"
        ? analysis.species.trim()
        : "",

    breed:
      typeof analysis.breed ===
      "string"
        ? analysis.breed.trim()
        : "",

    color:
      typeof analysis.color ===
      "string"
        ? analysis.color.trim()
        : "",

    markings:
      normalizeStringArray(
        analysis.markings
      ),

    facialFeatures:
      normalizeStringArray(
        analysis.facialFeatures
      ),

    distinctiveFeatures:
      normalizeStringArray(
        analysis.distinctiveFeatures
      ),
  };
}

// ============================================
// NORMALIZE STRING ARRAY
// ============================================

function normalizeStringArray(
  value: unknown
): string[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
        "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(
      (item) =>
        item.length > 0
    );
}

// ============================================
// JSON PARSER
// ============================================
//
// Gemini may occasionally return:
//
// ```json
// {...}
// ```
//
// or text around the JSON.
//
// This function handles those cases.
// ============================================

function parseJsonResponse<T>(
  text: string
): T {
  if (
    typeof text !==
      "string" ||
    !text.trim()
  ) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleaned =
    text.trim();

  // ------------------------------------------
  // REMOVE MARKDOWN CODE FENCES
  // ------------------------------------------

  cleaned =
    cleaned.replace(
      /^```json\s*/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /^```\s*/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /\s*```$/i,
      ""
    );

  cleaned =
    cleaned.trim();

  // ------------------------------------------
  // DIRECT JSON PARSE
  // ------------------------------------------

  try {
    return JSON.parse(
      cleaned
    ) as T;
  } catch {
    // Continue below.
  }

  // ------------------------------------------
  // FIND JSON OBJECT
  // ------------------------------------------

  const firstBrace =
    cleaned.indexOf(
      "{"
    );

  const lastBrace =
    cleaned.lastIndexOf(
      "}"
    );

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    const jsonText =
      cleaned.substring(
        firstBrace,
        lastBrace + 1
      );

    try {
      return JSON.parse(
        jsonText
      ) as T;
    } catch {
      // Continue below.
    }
  }

  // ------------------------------------------
  // FIND JSON ARRAY
  // ------------------------------------------

  const firstBracket =
    cleaned.indexOf(
      "["
    );

  const lastBracket =
    cleaned.lastIndexOf(
      "]"
    );

  if (
    firstBracket !== -1 &&
    lastBracket !== -1 &&
    lastBracket > firstBracket
  ) {
    const jsonText =
      cleaned.substring(
        firstBracket,
        lastBracket + 1
      );

    try {
      return JSON.parse(
        jsonText
      ) as T;
    } catch {
      // Continue below.
    }
  }

  // ------------------------------------------
  // INVALID RESPONSE
  // ------------------------------------------

  console.error(
    "Gemini invalid JSON response:",
    cleaned
  );

  throw new Error(
    "Gemini returned invalid JSON."
  );
}