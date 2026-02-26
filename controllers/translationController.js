import axios from "axios";
import TranslationCache from "../models/TranslationCache.js";

export const translateText = async (req, res) => {
    const { text, targetLang } = req.body;

    if (targetLang === "en") return res.json({ translatedText: text });

    const cached = await TranslationCache.findOne({
        originalText: text,
        targetLang
    });

    if (cached)
        return res.json({ translatedText: cached.translatedText });

    const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
        {
            q: text,
            target: targetLang
        }
    );

    const translated =
        response.data.data.translations[0].translatedText;

    await TranslationCache.create({
        originalText: text,
        targetLang,
        translatedText: translated
    });

    res.json({ translatedText: translated });
};