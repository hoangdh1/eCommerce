import { ICradle } from '../container';

import { cmsControllers } from '../controllers/V1/cms';

export const controllers = (iCradle: ICradle) => {
    return {
        v1: {
            cmsControllers: cmsControllers(iCradle),
        },
    };
};
