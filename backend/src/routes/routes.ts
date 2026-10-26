import { Router } from "express";
import { createShortUrlController, redirectToOriginalUrlController, resolveUrlController } from "../controllers/url.controllers";
export const router = Router();

router.post("/create-short-url", createShortUrlController);
router.get("/resolve/:shortCode", resolveUrlController);
router.get("/:shortCode", redirectToOriginalUrlController);

