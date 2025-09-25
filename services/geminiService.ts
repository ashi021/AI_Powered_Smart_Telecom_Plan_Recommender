import { GoogleGenAI, Type } from "@google/genai";
import type { TelecomPlan, UserProfile } from '../types';
import { COUNTRIES } from "../data/countries";

// FIX: Initialize the GoogleGenAI client with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the plan, e.g., 'verizon-play-more-5g'." },
        provider: { type: Type.STRING, description: "The telecom provider's name, e.g., 'Verizon'." },
        planName: { type: Type.STRING, description: "The specific name of the plan, e.g., '5G Play More'." },
        monthlyCost: { type: Type.NUMBER, description: "The monthly cost of the plan in the local currency as a number." },
        data: { type: Type.STRING, description: "Data allowance, e.g., '50GB', 'Unlimited'." },
        speed: { type: Type.STRING, description: "Network speed details, e.g., 'Up to 100Mbps', '5G Ultra Wideband'." },
        contractLength: { type: Type.STRING, description: "Contract length, e.g., '24 months', 'No Contract'." },
        ottServices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Included over-the-top (OTT) services like 'Netflix', 'Disney+'." },
        familyBenefits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Benefits specific to family plans, e.g., 'Discount per line'." },
        roaming: { type: Type.STRING, description: "Details about international roaming, e.g., 'Free roaming in Mexico & Canada'." },
        devicePerks: { type: Type.STRING, description: "Perks related to new devices, e.g., 'Free iPhone 15 on contract'." },
        pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key advantages of the plan." },
        cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key disadvantages of the plan." },
    },
    required: ["id", "provider", "planName", "monthlyCost", "data", "speed", "contractLength", "ottServices", "familyBenefits", "roaming", "devicePerks", "pros", "cons"]
};

const recommendationSchema = {
  type: Type.ARRAY,
  items: planSchema
};

function buildPrompt(profile: UserProfile, providers: string[]): string {
  const currency = COUNTRIES.find(c => c.code === profile.country)?.currency;
  const desiredServices = Object.entries(profile.services)
      .map(([category, values]) => (values.length > 0 ? `  - ${category.charAt(0).toUpperCase() + category.slice(1)}: ${values.join(', ')}` : ''))
      .filter(Boolean)
      .join('\n');
      
  const providerInstruction = profile.preferredProviders.length > 0
    ? `IMPORTANT: The user has a strong preference for the following providers. Please ONLY recommend plans from this list: ${profile.preferredProviders.join(', ')}.`
    : `Feel free to recommend plans from any of the major providers in the region, such as: ${providers.join(', ')}.`;


  return `
    You are an expert telecom plan advisor.
    Based on the following user profile, recommend the top 3 telecom plans available in their region.
    Analyze the user's needs and provide a balanced view with pros and cons for each plan.
    ${providerInstruction}
    
    User Profile:
    - Country Code: ${profile.country}
    - City: ${profile.city}
    - Currency: ${currency?.name} (${currency?.symbol})
    - Number of Lines: ${profile.numUsers}
    - Monthly Data Usage: ~${profile.dataUsage} GB
    - Primary Uses: ${profile.primaryUses.join(', ')}
    - Monthly Budget: Up to ${currency?.symbol}${profile.budget}
    - Needs a new device: ${profile.wantsNewDevice ? 'Yes' : 'No'}
    
    Desired Features & Perks:
${desiredServices || '  - No specific features requested.'}

    Your task is to return a JSON array of exactly 3 plan recommendations that are the best fit for this user.
    For each plan, provide a unique 'id' in the format 'provider-plan-name' (all lowercase, hyphenated).
    Fill out all fields in the provided JSON schema. If a specific field is not applicable (e.g., 'familyBenefits' for a single-line plan), provide a sensible default like an empty array for lists, or 'N/A' for strings. The monthlyCost must be a number in ${currency?.code}.
  `;
}

export const getTelecomRecommendations = async (profile: UserProfile, providers: string[]): Promise<TelecomPlan[]> => {
    try {
        const prompt = buildPrompt(profile, providers);
        
        // FIX: Use the recommended 'gemini-2.5-flash' model and call ai.models.generateContent.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            },
        });

        // FIX: Extract text directly from the 'text' property of the response.
        const jsonText = response.text.trim();
        if (!jsonText) {
          throw new Error("Received an empty response from the AI. The model may not have recommendations for the selected region.");
        }

        const plans: TelecomPlan[] = JSON.parse(jsonText);
        
        if (!Array.isArray(plans) || plans.length === 0) {
            throw new Error("AI response was not a valid list of plans. Please try adjusting your criteria.");
        }
        
        return plans;

    } catch (error) {
        console.error("Error fetching telecom recommendations:", error);
        let message = "An unknown error occurred while fetching recommendations.";
        if (error instanceof Error) {
            message = `Failed to get recommendations from AI: ${error.message}`;
        }
        
        throw new Error(message);
    }
};