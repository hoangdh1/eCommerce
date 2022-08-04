import { ICradle } from '../container';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const limitBuyMiddleware = (iCradle: ICradle) => {
    const { helpers, repositories } = iCradle;

    const { validation, responseHelper } = helpers;

    const checkLimitBuy = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { order_id, count } = validation
                .validate(req.body, locale)
                .valid({
                    order_id: Joi.string().trim().uuid().required(),
                    count: Joi.number().required(),
                });

            const countBought =
                await repositories.orderItemsRepository.checkLimitBuy({
                    order_id,
                });

            const limitBuy = process.env.LIMIT_BUY_CUSTOMER || 500;

            if (countBought + count > limitBuy) {
                return responseHelper.errorResponse({
                    req,
                    res,
                    status_code: 400,
                    message: `Exceed the limit on the number of products possible`,
                    exception_code: -1,
                });
            }

            next();
        } catch (e) {
            next();
            return e;
        }
    };

    return { checkLimitBuy };
};
