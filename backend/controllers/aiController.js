import { askSuggestion } from "../services/openaiService.js";

export const getSuggestion = async (req, res, next) => {
  try {
    const parameterKey = req.body.parameterKey;
    const defaultValue = req.body.defaultValue;

    const answer = await askSuggestion(parameterKey, defaultValue);
    console.log("AI responded:", answer);
    res.status(201).json({
      success: true,
      data: answer,
      message: "Answered successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
