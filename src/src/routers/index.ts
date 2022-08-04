import { ICradle } from '../container';
import express from 'express';
import { registerRouterV1 } from './v1';

export const routers = (iCradle: ICradle) => {
    const routers = express.Router();

    routers.use('/v1', registerRouterV1(iCradle));

    return { routers };
};
