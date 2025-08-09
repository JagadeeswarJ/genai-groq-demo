import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const all_models = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-8b-8192",
  "llama3-70b-8192",
  // "deepseek-r1-distill-llama-70b",
];

export async function llm(model, prompt) {
  const chatCompletion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `You are a JSON API that returns only valid JSON without extra text.
                  JSON format:
                  {
                    "name": "string",
                    "age": number
                  }
                  Only extract name and age if provided, don't guess randomly.
                  If you can't find them, return NA for name, and 0 for age`,
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  const jsonText = chatCompletion.choices[0].message.content.trim();
  // console.log(jsonText)
  return JSON.parse(jsonText);
}

const prompt = `hello i am jagadeeswar, i am 19 years old and live in hyderabad`;

(async () => {
  for (const model of all_models) {
    const start = Date.now();
    const res = await llm(model, prompt);
    const end = Date.now();
    console.log(model, res, `=> in ${end - start}ms`);
  }
})();
