import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

const JoiDate = require('joi').extend(require('@joi/date'));

export const orderItemsController = ({ useCases, helpers }: ICradle) => {
    const { orderItemsUseCase } = useCases;
    const { validation, responseHelper, cacheHelper, otherHelper } = helpers;

    const getOrderItemInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const orderItemCache = await cacheHelper.getCache({ req });

            if (orderItemCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: orderItemCache,
                    status_code: 201,
                });
            } else {
                const order_item_info =
                    await orderItemsUseCase.getOrderItemInfo({
                        req,
                        id,
                    });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: order_item_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewOrderItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { order_id, product_id, count } = validation
                .validate(req.body, locale)
                .valid({
                    order_id: Joi.string().trim().uuid().required(),
                    product_id: Joi.string().trim().uuid().required(),
                    count: Joi.number().required(),
                });

            await orderItemsUseCase.createNewOrderItem({
                req,
                order_id,
                product_id,
                count,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new order item succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateOrderItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, order_id, product_id, count } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    order_id: Joi.string().trim().uuid(),
                    product_id: Joi.string().trim().uuid(),
                    count: Joi.number(),
                });

            const updatedOrderItem = await orderItemsUseCase.updateOrderItem({
                req,
                id,
                order_id,
                product_id,
                count,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update orderItem succeed',
                data: updatedOrderItem,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteOrderItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await orderItemsUseCase.deleteOrderItem({
                req,
                id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete order item succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const getBestSelling = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { day } = validation.validate(req.body, locale).valid({
                day: JoiDate.date().format('YYYY-MM-DD').required(),
            });

            // console.log('check day: ', day);

            const day_format = otherHelper.convertToTimestamp(day);
            // console.log('day format: ', day_format);

            const best_selling_cache = await cacheHelper.getCache({
                keyword: 'getBestSelling',
            });

            if (best_selling_cache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: best_selling_cache,
                    status_code: 201,
                });
            }
            const best_selling = await orderItemsUseCase.getBestSelling({
                day_format,
            });

            return responseHelper.successResponse({
                req,
                res,
                data: best_selling,
                status_code: 201,
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getOrderItemInfo,
        createNewOrderItem,
        updateOrderItem,
        deleteOrderItem,
        getBestSelling,
    };
};
