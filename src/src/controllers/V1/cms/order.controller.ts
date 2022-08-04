import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const ordersController = ({ useCases, helpers }: ICradle) => {
    const { ordersUseCase } = useCases;
    const { validation, responseHelper, cacheHelper } = helpers;

    const getOrderInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const orderCache = await cacheHelper.getCache({ req });

            if (orderCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: orderCache,
                    status_code: 201,
                });
            } else {
                const order_info = await ordersUseCase.getOrderInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: order_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const getOrderList = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { shipper_id } = validation
                .validate(req.query, locale)
                .valid({
                    shipper_id: Joi.string().trim().uuid().required(),
                });

            const order_list_cache = await cacheHelper.getCache({
                keyword: `order_list_${shipper_id}`,
            });

            if (order_list_cache?.length) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: order_list_cache,
                    status_code: 201,
                });
            } else {
                const order_list = await ordersUseCase.getOrderList({
                    shipper_id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: order_list,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewOrder = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { customer_id, shipper_id } = validation
                .validate(req.body, locale)
                .valid({
                    customer_id: Joi.string().trim().uuid().required(),
                    shipper_id: Joi.string().trim().uuid().required(),
                });

            await ordersUseCase.createNewOrder({
                req,
                customer_id,
                shipper_id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new order succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateOrder = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, customer_id, shipper_id, total, status } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    customer_id: Joi.string().trim().uuid(),
                    shipper_id: Joi.string().trim().uuid(),
                    total: Joi.number(),
                    status: Joi.string().trim(),
                });

            const updatedOrder = await ordersUseCase.updateOrder({
                req,
                id,
                customer_id,
                shipper_id,
                total,
                status,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update order succeed',
                data: updatedOrder,
            });
        } catch (e) {
            return next(e);
        }
    };

    const exportOrder = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, status } = validation.validate(req.body, locale).valid({
                id: Joi.string().trim().uuid().required(),
                status: Joi.string().trim().required(),
            });

            const updatedOrder = await ordersUseCase.exportOrder({
                req,
                id,
                status,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Change status order to exported succeed',
                data: updatedOrder,
            });
        } catch (e) {
            return next(e);
        }
    };

    const assignShipper = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, shipper_id } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    shipper_id: Joi.string().trim().uuid().required(),
                });

            const updatedOrder = await ordersUseCase.assignShipper({
                req,
                id,
                shipper_id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Assign shipper for order succeed',
                data: updatedOrder,
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateStatusOrder = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, shipper_id, status } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    shipper_id: Joi.string().trim().uuid().required(),
                    status: Joi.string().trim().required(),
                });

            const updatedOrder = await ordersUseCase.updateStatusOrder({
                req,
                id,
                shipper_id,
                status,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update status order succeed',
                data: updatedOrder,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteOrder = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await ordersUseCase.deleteOrder({
                req,
                id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete order succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getOrderInfo,
        getOrderList,
        createNewOrder,
        updateOrder,
        exportOrder,
        assignShipper,
        updateStatusOrder,
        deleteOrder,
    };
};
