import express from "express";
import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const gemini = async (req, res) => {
  try {
    const { userLat, userLng, places } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
User is at (${userLat}, ${userLng})
Nearby places:
${JSON.stringify(places)}

Pick ONLY the shortest-distance place.
Return JSON:
{
  "name": "",
  "lat": ,
  "lng":
}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Cleanup JSON
    const cleaned = text.replace(/```json|```/g, "");
    const best = JSON.parse(cleaned);

    return res.json({ best });
  } catch (err) {
    console.error("AI error:", err);
    return res.status(500).json({ error: "AI processing failed" });
  }
};
