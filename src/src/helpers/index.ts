import { ICradle } from 'src/container';
import { responseHelper } from './response.helper';
import { validation } from './validation.helper';
import { otherHelper } from './other.helper';
import { loggerHelper } from './logger.helper';
import { cacheHelper } from './cache.helper';
import { mailHelper } from './mail.helper';

export const helpers = (iCradle: ICradle) => {
    return {
        responseHelper: responseHelper(iCradle),
        validation: validation(iCradle),
        otherHelper: otherHelper(iCradle),
        loggerHelper: loggerHelper(iCradle),
        cacheHelper: cacheHelper(iCradle),
        mailHelper: mailHelper(iCradle),
    };
};
