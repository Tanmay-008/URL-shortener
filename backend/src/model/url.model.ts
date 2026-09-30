import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    shortUrlCode: {
        type: String,
        unique: true,
        required: true
    },
    expiresAt: {
        type: Date,
        expires: 0
    }
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export { ShortUrl };