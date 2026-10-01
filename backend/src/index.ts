import dotenv from 'dotenv';
dotenv.config();
import { app } from "./app"

import { getChildLogger } from './utils/logger';
const logger = getChildLogger("PORT");

import { dbConnection } from './db/dbConnection';
dbConnection();


const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    logger.info(`URL Shortener Server is running on port:${PORT}`);
});