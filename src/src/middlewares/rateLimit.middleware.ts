import { ICradle } from '../container';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Joi from 'joi';

export const rateLimitMiddleware = (iCradle: ICradle) => {
    const { helpers, useCases } = iCradle;

    const { validation, responseHelper } = helpers;
    const { setupRedis } = iCradle;

    const redis = setupRedis.redis;

    const rateLimitPerSecond = (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const limiterPerSecond = new RateLimiterRedis({
            storeClient: redis,
            points: 20, // Number of points
            duration: 1, // Per second
        });

        limiterPerSecond
            .consume(req.ip)
            .then(() => {
                next();
            })
            .catch(_ => {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 429,
                    message: `Too many requests`,
                    exception_code: -1,
                });
            });
    };

    const checkLogin = async (
        req: Request,
        res: Response,
        next: NextFunction,
        role: string,
    ) => {
        try {
            // Validate before check rate limit
            const locale = 'VI';

            const { email, phone, password } = validation
                .validate(req.body, locale)
                .valid({
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                    password: Joi.string().trim().required(),
                });

            if (email || phone) {
                if (role == 'admin') {
                    const userLoginRes = await useCases.adminsUseCase.login({
                        req,
                        email,
                        phone,
                        password,
                    });

                    req.body.role = userLoginRes.token ? role : null;

                    next();
                }
                if (role == 'customer') {
                    const userLoginRes = await useCases.customersUseCase.login({
                        req,
                        email,
                        phone,
                        password,
                    });

                    req.body.role = userLoginRes.token ? role : null;

                    next();
                }
                if (role == 'shipper') {
                    const userLoginRes = await useCases.shippersUseCase.login({
                        req,
                        email,
                        phone,
                        password,
                    });

                    req.body.role = userLoginRes.token ? role : null;

                    next();
                }
            } else {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 400,
                    message: `Please enter your email address or phone`,
                    exception_code: -1,
                });
            }
        } catch (e) {
            next();
            return e;
        }
    };

    const rateLimitLogin = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            // console.log('check into rate limit login');
            // Validate before check rate limit
            const locale = 'VI';

            const { email, phone } = validation
                .validate(req.body, locale)
                .valid({
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                });

            const maxLoginFailOneMinute = 5;

            const limiterLoginFailOneMinute = new RateLimiterRedis({
                storeClient: redis,
                keyPrefix: 'login_fail_consecutive_email_and_ip',
                points: maxLoginFailOneMinute,
                duration: 60, // Delete key after 1 minute
                blockDuration: 60, // Block for 1 minute
            });

            // create key string
            const ipAddr = req.ip;
            // login key = (email or phone) + IP address
            const getLoginKey = (email, ip) => `${email}_${ip}`;
            const loginKey = getLoginKey(email || phone, ipAddr);

            // get keys for attempted login
            const resLoginKey = await limiterLoginFailOneMinute.get(loginKey);

            let retrySecs = 0;
            // Check if IP or email + IP is already blocked
            if (
                resLoginKey !== null &&
                resLoginKey.consumedPoints > maxLoginFailOneMinute
            ) {
                retrySecs = Math.round(resLoginKey.msBeforeNext / 1000) || 1;
            }

            // the IP and email + ip are not rate limited
            if (retrySecs > 0) {
                // sets the response’s HTTP header field
                res.set('Retry-After', String(retrySecs));
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 429,
                    message: `Too many requests. Retry after ${retrySecs} seconds.`,
                    exception_code: -1,
                });
            } else {
                const roleUser = req.body.role;
                if (!roleUser) {
                    try {
                        await limiterLoginFailOneMinute.consume(loginKey);

                        return responseHelper.errorResponse({
                            req,
                            res,
                            status_code: 400,
                            message: `Password is wrong`,
                            exception_code: -1,
                        });
                    } catch (e) {
                        const rlRejected: any = e;
                        if (rlRejected instanceof Error) {
                            throw rlRejected;
                        } else {
                            const timeOut =
                                Math.round(rlRejected.msBeforeNext / 1000) || 1;
                            res.set('Retry-After', String(timeOut));
                            // res.status(429).send('Too Many Requests');
                            return responseHelper.errorResponse({
                                req,
                                res,
                                status_code: 429,
                                message: `Too Many Requests`,
                                exception_code: -1,
                            });
                        }
                    }
                }

                if (roleUser) {
                    if (
                        resLoginKey !== null &&
                        resLoginKey.consumedPoints > 0
                    ) {
                        // Reset on successful authorisation
                        await limiterLoginFailOneMinute.delete(loginKey);
                    }
                }
            }
            next();
        } catch (e) {
            console.log(e);
            return next(e);
        }
    };

    return { rateLimitPerSecond, checkLogin, rateLimitLogin };
};
