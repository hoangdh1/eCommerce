import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const cartsController = ({ useCases, helpers }: ICradle) => {
    const { cartsUseCase } = useCases;
    const { validation, responseHelper, cacheHelper } = helpers;

    const getBasicInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const cartCache = await cacheHelper.getCache({ req });

            if (cartCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: cartCache,
                    status_code: 201,
                });
            } else {
                const cart_info = await cartsUseCase.getBasicInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: cart_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewCart = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { customer_id } = validation
                .validate(req.body, locale)
                .valid({
                    customer_id: Joi.string().trim().uuid().required(),
                });

            await cartsUseCase.createNewCart({
                req,
                customer_id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new cart succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateCart = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, total } = validation.validate(req.body, locale).valid({
                id: Joi.string().trim().uuid().required(),
                total: Joi.number(),
            });

            const updatedCart = await cartsUseCase.updateCart({
                req,
                id,
                total,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update cart succeed',
                data: updatedCart,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteCart = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await cartsUseCase.deleteCart({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete cart succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getBasicInfo,
        createNewCart,
        updateCart,
        deleteCart,
    };
};
