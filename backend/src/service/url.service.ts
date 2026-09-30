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
        let shortUrlEntry = await ShortUrl.findOne({ longUrl: url });

        if (shortUrlEntry) {
            logger.info(`Existing short URL found for: ${url}`);
            return shortUrlEntry;
        }

        const shortCode = generateShortCode();

        const baseUrl = "https://url-shortener.tanmayshirbhayye.tech";

        const shortUrl = `${baseUrl}/${shortCode}`;

        logger.info(`Generated new short code: ${shortCode} for URL: ${url}`);

        let expiresData: Date | undefined;
        if (expirationTimeInDays) {
            expiresData = new Date();
            expiresData.setDate(expiresData.getDate() + Number(expirationTimeInDays));
        }

        shortUrlEntry = new ShortUrl({
            longUrl: url,
            shortUrl,
            shortUrlCode: shortCode,
            expiresData
        });

        await shortUrlEntry.save();
        logger.info(`Successfully saved short URL entry to database for code: ${shortCode}`);

        return shortUrlEntry;
    } catch (error) {
        logger.error(`Error while creating short URL for ${url}:`, error);
        throw new ApiError(500, "Internal Server Error while creating short URL");
    }
};

export const getOriginalUrlService = async (shortCode: string) => {
    logger.info(`Attempting to retrieve original URL for short code: ${shortCode}`);
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

        shortUrlEntry.clicks += 1;
        await shortUrlEntry.save();

        logger.info(`Successfully retrieved and updated click count for short code: ${shortCode}`);
        return shortUrlEntry.longUrl;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        logger.error(`Error retrieving original URL for code ${shortCode}:`, error);
        throw new ApiError(500, "Internal Server Error while retrieving URL");
    }
};