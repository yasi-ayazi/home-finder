import type { ErrorRequestHandler, RequestHandler } from "express";

export class HttpError extends Error {
    public constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
    }
}

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
    next(
        new HttpError(404, "NOT_FOUND", "The requested resource was not found"),
    );
};

export function createErrorHandler(isProduction: boolean): ErrorRequestHandler {
    return (error: unknown, _request, response, _next) => {
        const knownError = error instanceof HttpError;
        const status = knownError ? error.status : 500;
        const code = knownError ? error.code : "INTERNAL_ERROR";
        const message = knownError
            ? error.message
            : "An unexpected error occurred";

        if (!knownError && !isProduction) {
            console.error(error);
        }

        response.status(status).json({ error: { code, message } });
    };
}
