import mongoose from "mongoose";
import { getChildLogger } from "../utils/logger";

const logger = getChildLogger("DB_CONNECTION");

export const dbConnection = async () => {
    mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB connection lost. Reconnecting...");
    });

    mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected successfully");
    });

    mongoose.connection.on("error", (err) => {
        logger.error("MongoDB runtime connection error", { error: err.message, stack: err.stack });
    });

    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoUri);

        logger.info("MongoDB connected successfully", { host: conn.connection.host });
    } catch (error: any) {
        logger.error("MongoDB initial connection failed", {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};