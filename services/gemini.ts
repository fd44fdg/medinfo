import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Indicator {
  name: string;
  value: string;
  unit: string;
  status: 'Normal' | 'Warning' | 'Critical';
  interpretation: string;
}

export interface MedicalAnalysis {
  summary: string;
  indicators: Indicator[];
}

export const analyzeMedicalReport = async (reportText: string, imageBase64?: string): Promise<MedicalAnalysis> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `
      你现在是一位经验丰富、和蔼可亲的老医生，也是用户的老朋友。
      用户的体检报告里有以下内容让他感到困惑或担忧。
      
      你的任务是：
      1. 识别报告中的关键指标（特别是异常项）。
      2. 用通俗易懂、像聊天一样的语气为他解读。
      3. 返回结构化的 JSON 数据以便生成可视化卡片。

      对于每一个异常指标，请在 "indicators" 数组中详细列出，并在 "summary" 中用大白话综合解释：
      - 这是啥？ (含义)
      - 严重吗？ (风险评估)
      - 咋整？ (建议)

      如果用户只发了图片，请OCR识别图片内容并分析。
    `;

    // Define the schema for structured output
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "A friendly, conversational markdown summary. Use bold text and bullet points. Explain what the indicators mean, if they are serious, and give lifestyle advice.",
        },
        indicators: {
          type: Type.ARRAY,
          description: "List of extracted medical indicators found in the input.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the indicator (e.g., ALT, Blood Pressure)" },
              value: { type: Type.STRING, description: "The numerical value or result found" },
              unit: { type: Type.STRING, description: "The unit of measurement (e.g., U/L, mmHg)" },
              status: { 
                type: Type.STRING, 
                enum: ["Normal", "Warning", "Critical"],
                description: "Assessment of the value." 
              },
              interpretation: { type: Type.STRING, description: "Very short (5-10 words) interpretation for the card UI." }
            },
            required: ["name", "value", "status", "interpretation"]
          }
        }
      },
      required: ["summary", "indicators"]
    };

    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or detect from source
          data: imageBase64
        }
      });
    }
    
    if (reportText) {
      parts.push({ text: reportText });
    } else if (!imageBase64) {
      // Fallback prompt if empty
      parts.push({ text: "Please analyze this medical context." });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more accurate extraction
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as MedicalAnalysis;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("解读服务暂时不可用，请检查网络或重试。");
  }
};