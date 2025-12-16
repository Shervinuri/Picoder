import { GoogleGenAI } from "@google/genai";

// Hardcoded API Keys Pool (Round Robin Strategy)
const API_KEYS = [
  "AIzaSyAPtBLORJurabBogkau9Qzmxu1LwL-BHUk",
  "AIzaSyAd4f8femLuXFDIC6K52Gdz2H1R1eqB0Yg",
  "AIzaSyD-j8tztOKHdey_jdF6eILymqSICxpMCXw",
  "AIzaSyDud_JXcH9wHEhCixMfqcloQ1kench84Bg",
  "AIzaSyBfdPXxvX6EPEBdynqJZONafpoHW8RcJoQ",
  "AIzaSyCxEeY8Ma7C5K6g5GuqF0Qi45XMOOox-Ko",
  "AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4",
  "AIzaSyB-teuLmY0TM4IXVebladMJGbEvZQnTakw",
  "AIzaSyB3J_zoDvY5TDNVOzAHe_JvXDYmyEsC6nI",
  "AIzaSyDGFOk31BX20g91iODYrUGbs5y8HGbnHns",
  "AIzaSyC78rpRgXtQCjSjxzwed8-roVz02gz7G9k",
  "AIzaSyBRWbQwZ2FMsCFT8rGGAGMy-FNXPyMFnYQ",
  "AIzaSyAfdSjyViGbtyktFAyRudfkNyW-rLFbpoI",
  "AIzaSyAvl7mBKFL3xm9hxUbSaOdF2a48OCqLJvY",
  "AIzaSyD9HtVplqbCG_nVROt1xedz6YO0o1UICwc",
  "AIzaSyAuL94ws2_XOwutCg6F0AawkZCsOS3JWNU",
  "AIzaSyDtbcAlT4Hq0KrvbsLDVc8l5woyXKOn5KA",
  "AIzaSyDB1skJ1a9FugEr5uqvR2So55xHeWpI6AU",
  "AIzaSyC4r12YtLcuYKni5gZiUZiRFxxI8i6kq64",
  "AIzaSyAAb-1TeJpIvdmILCaqu3zWas5IkG8Sh_Q",
  "AIzaSyCPTsmBnXHTYe9JUJGtG_di6u7spMOkti4",
  "AIzaSyAzu8BqBtkrJjCVeNJSHDX03i1nh9Urrw8",
  "AIzaSyBaR4ppPJSD1HDJlZ7XRwqjxtzvJw4iYhM",
  "AIzaSyBrm7foBjjJ4757DLcBG92OpD1OLzLM1HE",
  "AIzaSyDTEcL_dMMdPmJHf_LcqfWw8VWGijHGb_E",
  "AIzaSyAe5Mx8DAKyO2vemkoxBJOy4KgzjZv-63A",
  "AIzaSyDdZOVIaxjM9M1tZRtu9fAARlKyb0UCqRo",
  "AIzaSyCAUT94EMMAPc-eu04_GMCpgkdjChbX9hw",
  "AIzaSyC5qEJ7TBSxndhoB3ZzogVxAbiCkqKg8TU",
  "AIzaSyCMJASvij_Ai2HfU1Sa8nQeV3-vyoDmV5o"
];

let currentKeyIndex = 0;

const getNextKey = () => {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  console.log(`Using Key Index: ${currentKeyIndex}`); // Debug log
  return key;
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const apiKey = getNextKey();
    const ai = new GoogleGenAI({ apiKey });
    
    // Strip header if present to get pure base64
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png', // Sending as PNG usually works best for generic base64
            },
          },
          {
            text: prompt + " Return ONLY the edited image.",
          },
        ],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};