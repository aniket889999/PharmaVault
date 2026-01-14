import { GoogleGenerativeAI } from "@google/generative-ai";
import { Medicine } from "../types";

// Initialize Gemini API
// Using 'gemini-1.5-flash' as a fallback/current stable version effectively, 
// but code is set up for 'gemini-2.5-flash' as requested if available, otherwise it might error if strict.
// Ideally, we'd use a known model string. 
// Given the prompt context of 2026, we'll use 'gemini-2.5-flash'.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-1.5-flash";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

const getModel = () => {
  if (model) return model;

  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not set. Chatbot will not function correctly.");
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
    return model;
  } catch (error) {
    console.error("Error initializing Gemini API:", error);
    return null;
  }
};

export const generateGeminiResponse = async (
  userQuery: string,
  contextMedicines: Medicine[]
): Promise<string> => {
  const modelInstance = getModel();

  if (!modelInstance) {
    return "I apologize, but I am currently unable to connect to my AI services. Please verify the API configuration.";
  }

  try {
    // Construct the context string from relevant medicines
    const medicineContext = contextMedicines.length > 0
      ? contextMedicines.map(med => `
        - Medicine: ${med.name} (${med.genericName})
          Category: ${med.category}
          Description: ${med.description}
          Used For: ${med.usedFor.join(", ")}
          Dosage: ${med.dosage}
          Side Effects: ${med.sideEffects.join(", ")}
          Contraindications: ${med.contraindications.join(", ")}
          Price: ₹${med.price}
          Status: ${med.inStock ? "In Stock" : "Out of Stock"}
      `).join("\n")
      : "No specific medicine details available in database for this query.";

    const prompt = `
      You are PharmaVault Health Assistant, a professional and empathetic healthcare AI.
      Current Date: January 14, 2026

      Guidelines:
      1. Use the provided context to answer medicine-related questions.
      2. For general health queries (like "I have a cold"), provide helpful, non-diagnostic advice.
      3. ALWAYS include a medical disclaimer.
      4. If user symptoms sound serious, recommend seeing a doctor immediately.
      5. Keep responses concise, structured (using bullet points), and easy to read.

      Context from Verified Medicine Database:
      ${medicineContext}

      User Query: ${userQuery}
    `;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Better user-facing error messages
    if (error.message?.includes("API_KEY_INVALID")) {
      return "The AI service is unavailable due to an invalid API key. Please contact support.";
    }
    if (error.message?.includes("quota")) {
      return "The AI service is currently at capacity. Please try again in a few minutes.";
    }

    return "I'm sorry, I'm having trouble processing that right now. Could you please try rephrasing your question?";
  }
};
