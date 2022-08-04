import { ICradle } from '../container';
import { Request, Response, NextFunction } from 'express';
import unless from 'express-unless';

const jwt = require('jsonwebtoken');

export const authMiddleware = (iCradle: ICradle) => {
    const { helpers } = iCradle;

    const { responseHelper } = helpers;

    const auth = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization'];
            // const token = req.headers['x-access-token'];
            // const token = authHeader && authHeader.split(' ')[1];
            // console.log('check token ', token);

            if (token == null) {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 401,
                    message: 'No token is provided',
                    exception_code: -1,
                });
            }

            jwt.verify(
                token,
                process.env.TOKEN_SECRET as string,
                (err: any, decoded: any) => {
                    if (err) {
                        return responseHelper.errorResponse({
                            req,
                            res,
                            status_code: 403,
                            message: 'Failed to authenticate token',
                            exception_code: -1,
                        });
                    } else {
                        req.body.userId = decoded.userId;
                        req.body.roleUser = decoded.roleUser;
                        // console.log('decode: ', decoded);
                        // console.log('check req body', req.body);
                        // if (req.body.role == "admin") {
                        //     next()
                        // }
                        return next();
                    }
                },
            );
        } catch (e) {
            console.log(e);
            return e;
        }
    };

    auth.unless = unless;

    const authAdmin = (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('req body from auth middleware shipper: ', req.body);
            const role = req.body.roleUser;
            // console.log('check role middleware', role);
            if (role === 'admin') {
                return next();
            } else {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 403,
                    message: 'User do not have permission',
                    exception_code: -1,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const authShipper = (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = req.body.roleUser;
            if (role === 'shipper') {
                return next();
            } else {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 403,
                    message: 'User do not have permission',
                    exception_code: -1,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { auth, authAdmin, authShipper };
};
