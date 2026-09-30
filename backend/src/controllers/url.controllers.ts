import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { getOriginalUrlService, createShortUrlService } from "../service/url.service";

export const createShortUrlController = asyncHandler(async (req: Request, res: Response) => {
    const { url, expirationTime } = req.body;
    if (!url) {
        throw new ApiError(400, "URL is required");
    }

    const shortUrl = await createShortUrlService(url, expirationTime);
    res.status(201).json({ success: true, data: shortUrl });
});

export const redirectToOriginalUrlController = asyncHandler(async (req: Request, res: Response) => {
    const { shortCode } = req.params;
    if (!shortCode) {
        throw new ApiError(400, "Short code is required");
    }

    const originalUrl = await getOriginalUrlService(shortCode);

    res.redirect(302, originalUrl);
});
