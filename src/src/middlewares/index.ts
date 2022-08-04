import { ICradle } from '../container';

import { authMiddleware } from './auth.middleware';
import { rateLimitMiddleware } from './rateLimit.middleware';
import { limitBuyMiddleware } from './limitBuy.middleware';
import { catchErrorMiddleware } from './catchError.middleware';

export const middlewares = (iCradle: ICradle) => {
    return {
        authMiddleware: authMiddleware(iCradle),
        rateLimitMiddleware: rateLimitMiddleware(iCradle),
        limitBuyMiddleware: limitBuyMiddleware(iCradle),
        catchErrorMiddleware: catchErrorMiddleware(iCradle),
    };
};
