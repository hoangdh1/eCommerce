import pino from 'pino';
import { ICradle } from 'src/container';

pino.destination({ sync: false });

export const loggerHelper = (iCradle: ICradle) => {
    const appLogger = pino(
        {
            base: null,
            timestamp: false,
            useLevelLabels: true,
        },
    );

    return {
        appLogger,
    };
};
