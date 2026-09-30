import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { createShortUrlService } from "../service/url.service";

export const createShortUrlController = asyncHandler(async (req: Request, res: Response) => {
    const { url, expirationTime } = req.body;
    if (!url) {
        throw new ApiError(400, "URL is required");
    }

    const response = await createShortUrlService(url, expirationTime);
    res.status(201).json({ success: true, data: response });
});

