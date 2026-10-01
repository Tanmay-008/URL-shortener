import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
export const app = express();


app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://url-shortener.tanmayshirbhayye.tech",
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import { router } from './routes/routes';
import { redirectToOriginalUrlController } from './controllers/url.controllers';
app.use("/api/v1/url", router);
app.get("/:shortCode", redirectToOriginalUrlController);