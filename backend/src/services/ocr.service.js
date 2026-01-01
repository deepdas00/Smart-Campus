import Tesseract from "tesseract.js";

export const extractTextFromImage = async (imagePath) => {
  const { data } = await Tesseract.recognize(
    imagePath,
    "eng",
    {
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:/- ",
      psm: 11
    }
  );

  return data.text;
};
