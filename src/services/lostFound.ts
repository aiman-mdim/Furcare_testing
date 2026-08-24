export interface AIMatchResult {
  listingId: string;
  confidence: number;
  reason: string;
  listing: any;
}

export interface FindPetMatchesResponse {
  matches: AIMatchResult[];
  analysis: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result as string;

        // Remove:
        // data:image/jpeg;base64,
        // data:image/png;base64,
        // etc.
        const base64 = result.split(",")[1];

        if (!base64) {
          reject(new Error("Could not read the image."));
          return;
        }

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the selected image."));
    };

    reader.readAsDataURL(file);
  });
};

export const lostFoundApi = {
  async findPetMatches(
    imageFile: File
  ): Promise<AIMatchResult[]> {
    if (!imageFile) {
      throw new Error("Please select a pet image.");
    }

    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error(
        "Please upload a JPG, PNG, or WEBP image."
      );
    }

    // 10 MB maximum
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error(
        "Image is too large. Please upload an image smaller than 10 MB."
      );
    }

    const imageBase64 = await fileToBase64(imageFile);

    const response = await fetch(
      "/api/gemini/find-pet-matches",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: imageFile.type,
        }),
      }
    );

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an invalid response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          `AI search failed with status ${response.status}.`
      );
    }

    if (!Array.isArray(data.matches)) {
      throw new Error(
        "AI search returned an invalid match list."
      );
    }

    return data.matches;
  },
};