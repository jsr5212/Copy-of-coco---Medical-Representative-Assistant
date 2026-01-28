
import { GoogleGenAI, Type } from "@google/genai";
import { MedicineData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractMedicineInfo = async (fileBase64: string, mimeType: string): Promise<MedicineData[]> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this pharmaceutical document and extract detailed information about the medicine brands mentioned. 
  For each brand, identify the division, medical specialty, indications, dosage, and USP (Unique Selling Proposition). 
  Focus ONLY on clinical medicine details. If the document is not a pharmaceutical glossary or doesn't contain brand names, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              division: { type: Type.STRING },
              specialty: { type: Type.STRING },
              indications: { type: Type.STRING },
              dosage: { type: Type.STRING },
              usp: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
            },
            required: ["brand", "division", "specialty", "indications", "usp"],
            propertyOrdering: ["brand", "division", "specialty", "indications", "dosage", "usp", "targetAudience"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response. This usually happens if the PDF content is unreadable or protected.");
    }

    const data = JSON.parse(response.text);
    
    if (!Array.isArray(data)) {
      throw new Error("The extracted data format is invalid. Please try a standard medicine glossary PDF.");
    }

    if (data.length === 0) {
      throw new Error("No pharmaceutical brands or clinical data were identified in this document. Please verify the content.");
    }

    return data.map((item: any, index: number) => ({
      ...item,
      id: `med-${Date.now()}-${index}`
    }));
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    
    // Pass through specific error messages
    if (error.message.includes("identified in this document") || error.message.includes("invalid")) {
      throw error;
    }
    
    if (error.message.includes("safety")) {
      throw new Error("Extraction blocked by safety filters. Ensure the document contains only standard clinical information.");
    }

    throw new Error("Failed to process the document. It may be too complex, password-protected, or corrupted.");
  }
};
