// import { defineFlow } from "@genkit-ai/ai/flow";


// export const validateStudentData = defineFlow(
//   {
//     name: "validateStudentData",
//     inputSchema: {
//       studentName: "string",
//       rollNo: "string",
//       extractedText: "string",
//     },
//     outputSchema: {
//       approved: "boolean",
//       confidence: "number",
//       reason: "string",
//     },
//   },
//   async ({ studentName, rollNo, extractedText }) => {

//     const cleanText = extractedText.toLowerCase();
//     const nameMatch = cleanText.includes(studentName.toLowerCase());
//     const rollMatch = cleanText.includes(rollNo);

//     let confidence = 0;

//     if (nameMatch) confidence += 0.5;
//     if (rollMatch) confidence += 0.5;

//     const approved = confidence >= 0.8;

//     return {
//       approved,
//       confidence,
//       reason: approved ? "Verified successfully" : "ID details mismatch",
//     };
//   }
// );



export const validateStudentData = ({ studentName, rollNo, extractedText }) => {

  const cleanText = extractedText.toLowerCase();

  const nameMatch = cleanText.includes(studentName.toLowerCase());
  const rollMatch = cleanText.includes(rollNo);

  let confidence = 0;
  if (nameMatch) confidence += 0.5;
  if (rollMatch) confidence += 0.5;

  const approved = confidence >= 0.8;
     console.log("confidence",confidence);
     
  return {
    approved,
    confidence,
    reason: approved ? "Verified successfully" : "ID details mismatch",
  };
};
