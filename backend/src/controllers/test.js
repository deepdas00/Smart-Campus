import { validateStudentData } from "../services/aiValidation.service.js";
import { extractTextFromImage } from "../services/ocr.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import sharp from "sharp";
import fs from "fs";
import OpenAI from "openai";
export const registerStudentId = asyncHandler(async (req, res) => {

    const { studentName, rollNo } = req.body;
    const idImagePath = req.file.path;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const extractedText = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "user",
                content: "Extract all text from this image in JSON with fields if possible.",
            },
        ],
        input: [
            {
                role: "user",
                content: fs.readFileSync(idImagePath),
                type: "image",
            },
        ],
    });
    // const outputPath = `processed-${Date.now()}.png`;

    // await sharp(idImagePath)
    //     .resize({ width: 200 })      // enlarge text
    //     .grayscale()                  // remove colors
    //     .normalize()                  // increase contrast
    //     .threshold(150)               // black & white
    //     .toFile(outputPath);

    // 1️⃣ Extract text from ID card
    // const extractedText = await extractTextFromImage(idImagePath);


    console.log("llllllllllllllllllll", extractedText);

    // 2️⃣ AI validation using Genkit
    const result = await validateStudentData({
        studentName,
        rollNo,
        extractedText,
    });

    // 3️⃣ Apply decision
    if (!result.approved) {
        throw new ApiError(400, "ID verification failed");
    }

    // 4️⃣ Continue normal registration...
    res.status(201).json(new ApiResponse(201, result, "Registration successful"));
});
