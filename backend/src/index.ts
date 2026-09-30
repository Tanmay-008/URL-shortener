import dotenv from 'dotenv';
dotenv.config();
import { app } from "./app"

import { getChildLogger } from './utils/logger';
const logger = getChildLogger("PORT");

import { dbConnection } from './db/dbConnection';
dbConnection();


const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    logger.info(`URL Shortener Server is running on port:${PORT}`);
});