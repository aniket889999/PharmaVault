import { generateGeminiResponse } from '../services/geminiService';
import { searchMedicines } from '../data/enhancedMedicines';

export const generateHealthResponse = async (query: string): Promise<string> => {
  // 1. Search for relevant medicines based on query keywords
  const contextMedicines = searchMedicines(query);

  // 2. Generate response using Gemini with RAG context
  return await generateGeminiResponse(query, contextMedicines);
};

// Legacy function kept for backward compatibility
export const generateBasicHealthResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  // Basic symptom responses (fallback)
  const basicResponses: { [key: string]: string } = {
    'headache': `**Headaches** can have several common causes:

**Possible causes:**
• Dehydration or not eating enough
• Stress or tension
• Lack of sleep or poor sleep quality
• Eye strain from screens or bright lights

**Common medicines that may help:**
• **Paracetamol** - for headache relief, generally safe and effective
• **Ibuprofen** - can help with both headache and any inflammation
• Plenty of water - often the best first treatment

**Simple precautions:**
• Drink water slowly and steadily
• Rest in a quiet, dark room
• Apply a cold compress to your forehead

**When to consult a doctor:**
Please see a healthcare provider if you experience severe or worsening headache, persistent symptoms, nausea, vision changes, or fever.

Remember, this is general information only. Your health and safety are important, so don't hesitate to seek professional medical advice when in doubt.`,

    'fever': `**Fever** is your body's natural response to infection or illness:

**Possible causes:**
• Viral infections (cold, flu)
• Bacterial infections
• Inflammatory conditions

**Common medicines that may help:**
• **Paracetamol** - effective fever reducer and pain reliever
• **Ibuprofen** - reduces fever and inflammation
• Plenty of fluids to prevent dehydration

**Simple precautions:**
• Rest and get plenty of sleep
• Drink lots of fluids (water, herbal teas, broths)
• Wear light, breathable clothing

**When to consult a doctor:**
Seek medical attention for fever above 103°F (39.4°C), persistent fever for more than 3 days, difficulty breathing, severe headache, or signs of dehydration.

Remember, this is general information only. Your health and safety are important, so don't hesitate to seek professional medical advice when in doubt.`
  };

  // Check for basic symptoms
  for (const [symptom, response] of Object.entries(basicResponses)) {
    if (lowerQuery.includes(symptom)) {
      return response;
    }
  }

  // Default response
  return `Thank you for your health question. For the most comprehensive assistance, please describe your specific symptoms or health concerns.

**I can help with information about:**
• Common symptoms and their causes
• General medicine information
• When to see a doctor
• Basic health precautions

Remember, this is general information only. Your health and safety are important, so don't hesitate to seek professional medical advice when in doubt.`;
};