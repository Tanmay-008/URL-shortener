import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { getOriginalUrlService, createShortUrlService } from "../service/url.service";

export const getFrontendBaseUrl = (req?: Request): string => {
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL.replace(/\/$/, "");
    }

    const origin = req?.get("origin") || req?.get("referer");
    if (origin) {
        try {
            const urlObj = new URL(origin);
            return urlObj.origin;
        } catch {
            // ignore invalid URL format
        }
    }

    const host = req?.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return "http://localhost:5173";
    }

    return "https://url-shortener.tanmayshirbhayye.tech";
};

export const createShortUrlController = asyncHandler(async (req: Request, res: Response) => {
    const { url, expirationTime } = req.body;
    if (!url) {
        throw new ApiError(400, "URL is required");
    }

    const shortUrl = await createShortUrlService(url, expirationTime);
    res.status(201).json({ success: true, data: shortUrl });
});

export const redirectToOriginalUrlController = asyncHandler(async (req: Request, res: Response) => {
    const rawShortCode = req.params.shortCode;
    const shortCode = Array.isArray(rawShortCode) ? rawShortCode[0] : rawShortCode;
    if (!shortCode) {
        throw new ApiError(400, "Short code is required");
    }

    try {
        const originalUrl = await getOriginalUrlService(shortCode);
        return res.redirect(302, originalUrl);
    } catch (error: any) {
        const acceptHeader = req.get("accept") || "";
        const prefersJson = acceptHeader.includes("application/json") && !acceptHeader.includes("text/html");

        const statusCode = error instanceof ApiError ? error.statusCode : 500;
        const message = error.message || "Failed to retrieve URL";

        if (prefersJson) {
            return res.status(statusCode).json({
                success: false,
                statusCode,
                message,
                isExpired: statusCode === 410,
                isNotFound: statusCode === 404
            });
        }

        const frontendUrl = getFrontendBaseUrl(req);
        let reason = "error";
        if (statusCode === 410) {
            reason = "expired";
        } else if (statusCode === 404) {
            reason = "not_found";
        }

        const redirectUrl = `${frontendUrl}/expired?code=${encodeURIComponent(shortCode)}&reason=${reason}&message=${encodeURIComponent(message)}`;
        return res.redirect(302, redirectUrl);
    }
});

export const resolveUrlController = asyncHandler(async (req: Request, res: Response) => {
    const rawShortCode = req.params.shortCode;
    const shortCode = Array.isArray(rawShortCode) ? rawShortCode[0] : rawShortCode;
    if (!shortCode) {
        throw new ApiError(400, "Short code is required");
    }

    const originalUrl = await getOriginalUrlService(shortCode);
    return res.status(200).json({
        success: true,
        data: {
            shortCode,
            originalUrl
        }
    });
});

