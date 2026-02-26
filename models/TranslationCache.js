import mongoose from "mongoose";

const translationCacheSchema = new mongoose.Schema({
    originalText: String,
    targetLang: String,
    translatedText: String
});

translationCacheSchema.index({ originalText: 1, targetLang: 1 }, { unique: true });

export default mongoose.model("TranslationCache", translationCacheSchema);