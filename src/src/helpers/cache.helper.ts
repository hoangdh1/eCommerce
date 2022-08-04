import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';

export const cacheHelper = (iCradle: ICradle) => {
    const { setupRedis } = iCradle;

    const redis = setupRedis.redis;

    const getCache = async ({
        req,
        keyword,
    }: {
        req?: ExpressRequest;
        keyword?: string;
    }) => {
        const searchQuery = JSON.stringify(
            req?.query.id || req?.body.id || keyword,
        );
        const key = 'search:' + searchQuery;

        const value = await redis.get(key);
        if (value) {
            return JSON.parse(value);
        } else {
            return value;
        }
    };

    const setCache = async ({
        req,
        keyword,
        data,
    }: {
        req?: ExpressRequest;
        keyword?: string;
        data?: any;
    }) => {
        const searchQuery = JSON.stringify(
            req?.query.id || req?.body.id || keyword,
        );
        const key = 'search:' + searchQuery;

        // console.log('key cache: ', key);

        const results = JSON.stringify(data);

        return await redis.set(key, results);
    };

    const delCache = async ({
        req,
        keyword,
    }: {
        req?: ExpressRequest;
        keyword?: string;
    }) => {
        const searchQuery = JSON.stringify(
            req?.query.id || req?.body.id || keyword,
        );
        const key = 'search:' + searchQuery;

        return await redis.del(key);
    };

    return {
        getCache,
        setCache,
        delCache,
    };
};
