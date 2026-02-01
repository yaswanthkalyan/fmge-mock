import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-question", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768", // best balance quality + speed
        messages: [
          {
            role: "system",
            content:
              "You are an FMGE exam question setter. Generate a difficulty 5 clinical vignette MCQ. Return JSON only."
          },
          {
            role: "user",
            content: `Generate one high-difficulty FMGE MCQ on topic: ${topic}. 
Return JSON in this format:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "..."
}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);

    res.json(parsed);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

app.listen(5000, () => {
  console.log("AI server running on http://localhost:5000");
});
