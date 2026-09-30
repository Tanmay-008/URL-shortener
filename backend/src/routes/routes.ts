import { Router } from "express";
import { createShortUrlController, redirectToOriginalUrlController } from "../controllers/url.controllers";
export const router = Router();

router.post("/create-short-url", createShortUrlController);
router.get("/:shortCode", redirectToOriginalUrlController);
