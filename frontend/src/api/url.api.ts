import { axiosAPI } from "@/lib/axios";

export interface CreateShortUrlPayload {
    url: string;
    expirationTime?: number;
}

export interface ShortUrlData {
    _id: string;
    longUrl: string;
    shortUrl: string;
    shortUrlCode: string;
    expiresAt?: string;
    clicks: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * API function to create a shortened URL
 * Backend Route: POST /api/v1/url/create-short-url
 * Response Status: 201 Created on success
 */
export const createShortUrlApi = async (payload: CreateShortUrlPayload): Promise<ShortUrlData> => {
    try {
        const response = await axiosAPI.post("/create-short-url", {
            url: payload.url,
            expirationTime: payload.expirationTime,
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || "Failed to create short URL");
    } catch (error: any) {
        // Extract error message from backend ApiError or network error
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong while shortening your URL. Please try again.";

        throw new Error(errorMessage);
    }
};
