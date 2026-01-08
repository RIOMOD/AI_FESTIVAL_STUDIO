import { GoogleGenAI } from "@google/genai";

/**
 * Generates a festival-themed image using Gemini 2.5 Flash Image.
 * Adheres strictly to the Google GenAI SDK rules.
 */
export async function generateImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  // Always initialize with the environment variable as per requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract the image data from the response candidates
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("Không nhận được nội dung từ AI.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    throw new Error('Dữ liệu hình ảnh không tồn tại trong phản hồi.');
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error("Lỗi xác thực API Key. Vui lòng kiểm tra cấu hình hệ thống.");
      }
      throw error;
    }
    throw new Error('Đã xảy ra lỗi không xác định khi tạo ảnh.');
  }
}
