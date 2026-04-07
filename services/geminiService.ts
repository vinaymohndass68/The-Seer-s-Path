
import { GoogleGenAI, Type } from "@google/genai";
import { NumerologyResult, Scores, SuggestedName, PredictionData } from '../types';

// Use a specific model optimized for text generation
const MODEL_NAME = 'gemini-3-flash-preview';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

export const generatePrediction = async (
  result: NumerologyResult
): Promise<Partial<PredictionData>> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const targetDateObj = new Date(result.targetDate);
    const targetDateStr = targetDateObj.toLocaleDateString('default', { timeZone: 'UTC' });

    let prompt = '';
    let responseSchema = null;

    if (result.mode === 'COMPATIBILITY' && result.partner) {
      prompt = `
        Act as Cheiro. Perform a Relationship Compatibility Analysis using Chaldean Numerology.
        Subject A: ${result.fullName} (Birth: ${result.birthNumber}, Destiny: ${result.destinyNumber})
        Subject B: ${result.partner.fullName} (Birth: ${result.partner.birthNumber}, Destiny: ${result.partner.destinyNumber})
        Compare their numbers and provide a mystical synastry report.
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          predictionText: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              harmony: { type: Type.INTEGER, description: "A score from 1 to 10." },
              communication: { type: Type.INTEGER, description: "A score from 1 to 10." },
              longevity: { type: Type.INTEGER, description: "A score from 1 to 10." },
            },
            required: ["harmony", "communication", "longevity"],
          },
          yearlySummary: { type: Type.STRING }
        },
        required: ["predictionText", "scores", "yearlySummary"],
      };

    } else if (result.mode === 'COMPANY' && result.company) {
      prompt = `
        Act as Cheiro. Perform a Business Numerology Analysis for ${result.company.name}.
        Analyze if the name number ${result.company.nameNumber} fits the nature of work "${result.company.natureOfWork}" and harmonizes with the owner ${result.fullName} (Birth Number ${result.birthNumber}, Destiny Number ${result.destinyNumber}).
        Suggest 3 alternatives.
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          predictionText: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              businessSuccess: { type: Type.INTEGER, description: "A score from 1 to 10." },
              brandPower: { type: Type.INTEGER, description: "A score from 1 to 10." },
              ownerCompatibility: { type: Type.INTEGER, description: "A score from 1 to 10." },
            },
            required: ["businessSuccess", "brandPower", "ownerCompatibility"],
          },
          yearlySummary: { type: Type.STRING },
          suggestedNames: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                numerology: { type: Type.INTEGER },
                rationale: { type: Type.STRING }
              },
              required: ["name", "numerology", "rationale"]
            }
          }
        },
        required: ["predictionText", "scores", "yearlySummary", "suggestedNames"],
      };

    } else if (result.mode === 'PAST_LIFE') {
      prompt = `
        Act as Cheiro, the legendary mystic. Perform a deep Past Life and Karmic Reading using Compound Numbers: Name (${result.nameCompound}), Birth (${result.birthCompound}), and Destiny (${result.destinyCompound}).
        
        I need VIVID and SPECIFIC world-building for this analysis:
        1. **Environment**: Describe the physical world of that time. What was the climate? What did the architecture look like? Include sensory details (smells, sounds).
        2. **Societal Norms**: What were the unwritten rules? Describe the social hierarchy, gender expectations, and legal systems of that specific era and place.
        3. **Cultural Elements**: Describe the prevalent rituals, festivals, artistic styles, and spiritual beliefs that dominated that life.
        4. **Personal Life**: Role, occupation, and family status.
        
        Subject: ${result.fullName}
        Target Date for current Karmic insight: ${targetDateStr}
      `;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          predictionText: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              karmicIntensity: { type: Type.INTEGER, description: "A mystical score from 1 to 10 representing the weight of karma." },
              soulMaturity: { type: Type.INTEGER, description: "A mystical score from 1 to 10 representing incarnations experienced." },
              spiritualPotential: { type: Type.INTEGER, description: "A mystical score from 1 to 10 representing the current link to the divine." },
            },
            required: ["karmicIntensity", "soulMaturity", "spiritualPotential"],
          },
          pastLifeArchetype: { type: Type.STRING },
          pastLifePeriod: { type: Type.STRING },
          pastLifeRole: { type: Type.STRING },
          pastLifeCountry: { type: Type.STRING },
          pastLifePlace: { type: Type.STRING },
          pastLifeFamily: { type: Type.STRING },
          pastLifeEnvironment: { type: Type.STRING, description: "Vivid description of architecture, climate, and sensory details." },
          pastLifeSocietalNorms: { type: Type.STRING, description: "Detailed look at class structures, laws, and gender roles of that era." },
          pastLifeCulture: { type: Type.STRING, description: "Rituals, festivals, artistic styles, and prevalent beliefs." },
          pastLifeArtifacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific physical items of importance." },
          yearlySummary: { type: Type.STRING }
        },
        required: [
            "predictionText", "scores", "yearlySummary", "pastLifeArchetype", 
            "pastLifePeriod", "pastLifeRole", "pastLifeCountry", "pastLifePlace", 
            "pastLifeFamily", "pastLifeEnvironment", "pastLifeSocietalNorms", 
            "pastLifeCulture", "pastLifeArtifacts"
        ],
      };

    } else {
      // PERSONAL PROMPT
      prompt = `
        Act as Cheiro, the legendary Seer.
        Subject: ${result.fullName}
        Birth Number: ${result.birthNumber} (Inner Self)
        Destiny Number: ${result.destinyNumber} (Outer Purpose/Fate)
        Name Number: ${result.nameNumber} (Public Identity)
        
        Tasks:
        1. Analyze these numbers using Chaldean Numerology.
        2. Assign scores 1-10 for current favorability.
        3. Identify 4 "Turning Points" (future ages/years of transformation).
        4. NAME HARMONIZATION: Check if the current name number ${result.nameNumber} harmonizes with birth number ${result.birthNumber}. 
           If it is discordant, suggest 3 minor spelling variations of "${result.fullName}" (e.g. adding a letter like 'n' or 'e') that would produce a highly fortunate Name Number (1, 3, 5, 6, 9) which concordantly matches the Birth Number.
        5. Provide a mystical reading for ${targetDateStr}.
      `;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          predictionText: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              birth: { type: Type.INTEGER, description: "Score from 1 to 10." },
              destiny: { type: Type.INTEGER, description: "Score from 1 to 10." },
              name: { type: Type.INTEGER, description: "Score from 1 to 10." },
              year: { type: Type.INTEGER, description: "Score from 1 to 10." },
              month: { type: Type.INTEGER, description: "Score from 1 to 10." },
              day: { type: Type.INTEGER, description: "Score from 1 to 10." },
            },
            required: ["birth", "destiny", "name", "year", "month", "day"],
          },
          yearlySummary: { type: Type.STRING },
          turningPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                age: { type: Type.INTEGER },
                year: { type: Type.INTEGER },
                type: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["age", "year", "type", "description"]
            }
          },
          personalNameSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                numerology: { type: Type.INTEGER },
                rationale: { type: Type.STRING }
              },
              required: ["name", "numerology", "rationale"]
            }
          }
        },
        required: ["predictionText", "scores", "yearlySummary", "turningPoints"],
      };
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from Oracle");
    const data = JSON.parse(jsonText);

    // Final mapping and corrections
    let turningPoints = data.turningPoints;
    if (result.mode === 'PERSONAL' && turningPoints && Array.isArray(turningPoints)) {
        const birthYear = parseInt(result.birthDate.split('-')[0], 10);
        turningPoints = turningPoints.map((tp: any) => ({
            ...tp,
            year: birthYear + tp.age
        }));
    }

    return {
      text: data.predictionText,
      scores: data.scores,
      yearlySummary: data.yearlySummary,
      suggestedNames: data.suggestedNames,
      personalNameSuggestions: data.personalNameSuggestions,
      pastLifeArchetype: data.pastLifeArchetype,
      pastLifePeriod: data.pastLifePeriod,
      pastLifeRole: data.pastLifeRole,
      pastLifeCountry: data.pastLifeCountry,
      pastLifePlace: data.pastLifePlace,
      pastLifeFamily: data.pastLifeFamily,
      pastLifeEnvironment: data.pastLifeEnvironment,
      pastLifeSocietalNorms: data.pastLifeSocietalNorms,
      pastLifeCulture: data.pastLifeCulture,
      pastLifeArtifacts: data.pastLifeArtifacts,
      turningPoints: turningPoints
    };
  } catch (error) {
    console.error("Gemini Oracle Error:", error);
    throw error;
  }
};

export const generateMoreNameSuggestions = async (
  result: NumerologyResult,
  existingSuggestions: string[]
): Promise<SuggestedName[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Act as Cheiro. Provide 5 ADDITIONAL minor spelling variations for the name "${result.fullName}" 
      that harmonize with the Birth Number ${result.birthNumber}. 
      Do NOT include these variations: ${existingSuggestions.join(', ')}.
      Each variation should result in a fortunate Chaldean Name Number (1, 3, 5, 6, 9) that matches the birth number vibration.
    `;

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          numerology: { type: Type.INTEGER },
          rationale: { type: Type.STRING }
        },
        required: ["name", "numerology", "rationale"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from Oracle");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini More Names Error:", error);
    return [];
  }
};

export const generatePastLifeImage = async (prediction: Partial<PredictionData>): Promise<string | undefined> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    
    const imagePrompt = `
      A cinematic, atmospheric, and highly detailed visual representation of a past life setting.
      Location: ${prediction.pastLifePlace}, ${prediction.pastLifeCountry}.
      Period: ${prediction.pastLifePeriod}.
      Environment: ${prediction.pastLifeEnvironment}.
      Culture: ${prediction.pastLifeCulture}.
      Style: Mystical, historical realism, warm ethereal lighting, grain texture, like an old memory or a high-end film still.
      Aspect Ratio: 16:9 cinematic view.
    `;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Image generation error:", error);
    return undefined;
  }
};

export const generateArtifactImage = async (artifactName: string, prediction: Partial<PredictionData>): Promise<string | undefined> => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");
  
      const ai = new GoogleGenAI({ apiKey });
      
      const imagePrompt = `
        A high-detail, mystical macro photograph of a legendary soul artifact.
        Item: ${artifactName}.
        Context: From a past life in ${prediction.pastLifePlace}, ${prediction.pastLifeCountry} during the ${prediction.pastLifePeriod} era.
        Style: Dramatic museum lighting, dark velvet background, ethereal glow, realistic textures (metal, wood, stone, fabric), 8k resolution.
        Aspect Ratio: 1:1 square.
      `;
  
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL_NAME,
        contents: {
          parts: [{ text: imagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });
  
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return undefined;
    } catch (error) {
      console.error("Artifact image generation error:", error);
      return undefined;
    }
};
