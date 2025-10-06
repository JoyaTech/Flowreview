import { GoogleGenAI, Type } from "@google/genai";
import type { Review } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateReviewSummary(reviewText: string): Promise<string> {
  try {
    const prompt = `
      Analyze the sentiment of the following customer review and provide a very concise, one-sentence summary.
      The summary should capture the main feedback point and the overall sentiment (positive, negative, or mixed).

      **Review Text:**
      "${reviewText}"

      **Summary:**
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    throw new Error("Failed to generate AI summary.");
  }
}

export async function generateResponses(review: Review): Promise<string[]> {
  try {
    const prompt = `
      Act as a professional and empathetic reputation manager for a business.
      I have received the following customer review and need help drafting a response.

      **Business Context:** The business is a local cafe known for its quality coffee, friendly atmosphere, and delicious brunch options.
      
      **Review Details:**
      - **Rating:** ${review.rating} out of 5 stars.
      - **Review Text:** "${review.reviewText}"

      **Your Task:**
      Generate 3 distinct, professional, and context-aware response drafts.
      - If the review is positive (4-5 stars), the tone should be appreciative and welcoming. Thank the customer for specific points they mentioned.
      - If the review is negative (1-3 stars), the tone should be apologetic, empathetic, and constructive. Acknowledge their specific complaints and offer to make things right. Avoid making excuses.
      - Keep responses concise and professional.
      - Each response should be unique in its phrasing.

      Return the responses as a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single response draft."
          }
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const drafts = JSON.parse(jsonStr);

    if (Array.isArray(drafts) && drafts.every(d => typeof d === 'string')) {
      return drafts;
    } else {
      throw new Error("AI returned data in an unexpected format.");
    }

  } catch (error) {
    console.error("Error generating responses with Gemini API:", error);
    throw new Error("Failed to generate AI responses. Please check your API key and connection.");
  }
}