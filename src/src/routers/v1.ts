import { ICradle } from 'src/container';
import express from 'express';

import cmsRouter from './cms';

export const registerRouterV1 = (iCradle: ICradle) => {
    const routers = express.Router();

    routers.use('/cms',cmsRouter(iCradle));

    routers.get('/healthcheck', (req, res, next) => {
        return res.json('Healthcheck successfully');
    });

    return routers;
};
