import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const results = [];

fs.createReadStream("questions_master.csv")
  .pipe(csv())
  .on("data", (data) => {

  const options = [
    data.option_1?.trim(),
    data.option_2?.trim(),
    data.option_3?.trim(),
    data.option_4?.trim()
  ];

  const correctText = data.answer?.trim();

  // Find index of correct answer inside options
  const correctIndex = options.findIndex(
    (opt) => opt === correctText
  );

  if (
    !data.question ||
    options.includes(undefined) ||
    correctIndex === -1
  ) {
    console.log("❌ Skipping invalid row:", data.question);
    return;
  }

  results.push({
    subject: data.subject,
    sub_subject: data.topic || null,
    difficulty: parseInt(data.difficulty),
    question: data.question,
    options: options,
    correct: correctIndex,
    explanation: data.explanation,
    ai_generated: false
  });
})

  .on("end", async () => {

    console.log(`Uploading ${results.length} questions...`);

    if (results.length === 0) {
      console.log("No valid rows found.");
      process.exit();
    }

    // Insert in batches of 500 for safety
    const batchSize = 500;

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);

      const { error } = await supabase
        .from("questions")
        .insert(batch);

      if (error) {
        console.error("Upload failed:", error);
        process.exit();
      }
    }

    console.log("Upload successful!");
    process.exit();
  });
