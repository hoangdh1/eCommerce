import { ICradle } from 'src/container';
import Joi from 'joi';
import { validation } from './helpers/validation.helper';

export interface IEnv {
    /**
     * * Database
     */
    DB: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;

    /**
     * * Redis and Cache
     */
    CACHE: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    // REDIS_PASSWORD: string;
    // CACHE_TTL: number;

    /**
     * Bull
     */
    REDIS_BULL_HOST: string;
    REDIS_BULL_PORT: number;
    REDIS_BULL_PREFIX: string;
    // REDIS_BULL_PASSWORD?: string;

    /**
     * * JWT & Encryption
     */
    // JWT_ISSUER: string;
    // JWT_PUBLIC_KEY: string;
    // JWT_PRIVATE_KEY: string;
    // JWT_ALGORITHM: string;
    // JWT_EXPIRE_IN: string;

    // ACHECKIN_ID_JWT_RSA_PUBLIC_KEY: string;
    // ACHECKIN_ID_JWT_ISSUER: string;

    // ACCESS_TOKEN_EXPIRE_IN: string;
    // REFRESH_TOKEN_EXPIRE_IN: string;
    // ACHECKIN_JWT_PUBLIC_KEY: string;
    ENCRYPTION_KEY: string;

    /**
     * * Other
     */
    NODE_ENV: string;
    HOST: string;
    PORT: number;
    TIMEZONE: string;

    /**
     * PATH FILE
     */
    PUBLIC_SAMPLE_PATH_FILE: string;
}

export const registerEnv = (iCradle: ICradle) => {
    // const { helpers } = iCradle;
    const envs: IEnv = validation(iCradle)
        .validate(process.env)
        .valid({
            /**
             * * Database
             */
            NODE_ENV: Joi.string()
                .valid(...['local', 'development', 'production'])
                .required(),
            DB: Joi.string()
                .valid(...['postgres'])
                .required(),
            DB_HOST: Joi.string().required(),
            DB_PORT: Joi.number().required(),
            DB_NAME: Joi.string().required(),
            DB_USER: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),

            /**
             * * Redis and Cache
             */
            CACHE: Joi.string()
                .valid(...['REDIS'])
                .required(),
            REDIS_HOST: Joi.string().optional(),
            REDIS_PORT: Joi.number().optional(),
            // REDIS_PASSWORD: Joi.string().optional(),
            // CACHE_TTL: Joi.number().optional().default(200),

            /**
             * Bull
             */
            REDIS_BULL_HOST: Joi.string().required(),
            REDIS_BULL_PORT: Joi.number().default(6380),
            REDIS_BULL_PREFIX: Joi.string().required(),
            // REDIS_BULL_PASSWORD: Joi.string(),

            /**
             * * JWT & Encryption
             */
            // JWT_ISSUER: Joi.string().optional(),
            // JWT_PUBLIC_KEY: Joi.string().replace(/\\n/g, '\n').optional(),
            // JWT_PRIVATE_KEY: Joi.string().replace(/\\n/g, '\n').optional(),
            // JWT_ALGORITHM: Joi.string().optional().default('RS256'),
            // JWT_EXPIRE_IN: Joi.string().optional().default('1d'),

            // ACHECKIN_JWT_PUBLIC_KEY: Joi.string()
            //     .replace(/\\n/g, '\n')
            //     .optional(),
            // ACHECKIN_ID_JWT_ISSUER: Joi.string().optional(),

            // ACCESS_TOKEN_EXPIRE_IN: Joi.string().default('7d'),
            // REFRESH_TOKEN_EXPIRE_IN: Joi.string().default('30d'),
            ENCRYPTION_KEY: Joi.string().required(),

            PUBLIC_SAMPLE_PATH_FILE: Joi.string().optional(),
        });

    return envs;
};
