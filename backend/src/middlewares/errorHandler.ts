import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { getChildLogger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

declare global {
    namespace Express {
        interface Request {
            traceId?: string;
            logger?: Logger;
        }
    }
}

const log = getChildLogger('GlobalErrorHandler');

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {

    log.error('Unhandled Exception Caught', {
        traceId: req.traceId || 'NO_TRACE',
        path: req.path,
        method: req.method,
        errorMessage: err.message || 'Unknown Error',
        stack: err.stack,
    });

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            data: err.data
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            error: 'Invalid input data',
            details: err.errors
        });
    }

    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
        return res.status(503).json({
            success: false,
            statusCode: 503,
            error: 'Service temporarily unavailable. Please try again later.'
        });
    }

    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error'
    });
};