import { Router } from "express";
import { createShortUrlController } from "../controllers/url.controllers";
export const router = Router();

router.post("/create-short-url", createShortUrlController);

