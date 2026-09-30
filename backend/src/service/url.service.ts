import isUrl from "is-url";
import { ApiError } from "../utils/ApiError";
import { ShortUrl } from "../model/url.model";
import { generateShortCode } from "../utils/shortCodeGenretor";
import { getChildLogger } from "../utils/logger";

const logger = getChildLogger("UrlService");

export const createShortUrlService = async (url: string, expirationTimeInDays?: number) => {

    const validUrl = isUrl(url);
    if (!validUrl) {
        logger.warn(`Invalid URL provided: ${url}`);
        throw new ApiError(400, "Invalid URL");
    }

    try {
        const shortCode = generateShortCode();

        const baseUrl = "https://url-shortener.tanmayshirbhayye.tech";

        const shortUrl = `${baseUrl}/${shortCode}`;

        logger.info(`Generated new short code: ${shortCode} for URL: ${url}`);

        let expiresAt: Date | undefined;
        if (expirationTimeInDays) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + Number(expirationTimeInDays));
        }

        const shortUrlEntry = new ShortUrl({
            longUrl: url,
            shortUrl,
            shortUrlCode: shortCode,
            expiresAt
        });

        await shortUrlEntry.save();
        logger.info(`Successfully saved short URL entry to database for code: ${shortCode}`);

        return shortUrlEntry;
    } catch (error) {
        logger.error(`Error while creating short URL for ${url}:`, error);
        throw new ApiError(500, "Internal Server Error while creating short URL");
    }
};


export const getOriginalUrlService = async (shortCode: any) => {
    try {
        const shortUrlEntry = await ShortUrl.findOne({ shortUrlCode: shortCode });

        if (!shortUrlEntry) {
            logger.warn(`Short code not found in database: ${shortCode}`);
            throw new ApiError(404, "Short URL not found");
        }

        if (shortUrlEntry.expiresAt && new Date() > shortUrlEntry.expiresAt) {
            logger.warn(`Short code has expired: ${shortCode}`);
            throw new ApiError(410, "Short URL has expired");
        }

        logger.info(`Successfully retrieved and updated click count for short code: ${shortCode}`);
        return shortUrlEntry.longUrl;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        logger.error(`Error retrieving original URL for code ${shortCode}:`, error);
        throw new ApiError(500, "Internal Server Error while retrieving URL");
    }
};