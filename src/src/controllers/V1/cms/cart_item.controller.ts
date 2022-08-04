import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const cartItemsController = ({ useCases, helpers }: ICradle) => {
    const { cartItemsUseCase } = useCases;
    const { validation, responseHelper, cacheHelper } = helpers;

    const getCartItemInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const cartItemCache = await cacheHelper.getCache({ req });

            if (cartItemCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: cartItemCache,
                    status_code: 201,
                });
            } else {
                const cart_item_info = await cartItemsUseCase.getCartItemInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: cart_item_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewCartItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { cart_id, product_id, count } = validation
                .validate(req.body, locale)
                .valid({
                    cart_id: Joi.string().trim().uuid().required(),
                    product_id: Joi.string().trim().uuid().required(),
                    count: Joi.number().required(),
                });

            await cartItemsUseCase.createNewCartItem({
                req,
                cart_id,
                product_id,
                count,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new cart item succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateCartItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, count } = validation.validate(req.body, locale).valid({
                id: Joi.string().trim().uuid().required(),
                count: Joi.number(),
            });

            console.log('id: ', id);

            const updatedCartItem = await cartItemsUseCase.updateCartItem({
                req,
                id,
                count,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update cart item succeed',
                data: updatedCartItem,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteCartItem = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await cartItemsUseCase.deleteCartItem({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete cartItem succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getCartItemInfo,
        createNewCartItem,
        updateCartItem,
        deleteCartItem,
    };
};
