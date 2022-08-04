import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';
import moment from 'moment-timezone';

const JoiDate = require('joi').extend(require('@joi/date'));

export const productsController = ({ useCases, helpers }: ICradle) => {
    const { productsUseCase } = useCases;
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

            const productCache = await cacheHelper.getCache({ req });

            if (productCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: productCache,
                    message: 'Get info of product successfully',
                    status_code: 201,
                });
            } else {
                const product_info = await productsUseCase.getBasicInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: product_info,
                    message: 'Get info of product successfully',
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const getListProduct = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { limit, offset } = validation
                .validate(req.body, locale)
                .valid({
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                });

            // console.log('check limit offset: ', limit);
            const product_list_cache = await cacheHelper.getCache({
                keyword: 'getListProduct',
            });

            if (product_list_cache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: product_list_cache,
                    message: 'Get list product successfully',
                    status_code: 201,
                });
            } else {
                const product_list = await productsUseCase.getListProduct({
                    limit,
                    offset,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: product_list,
                    message: 'Get list product successfully',
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const searchProduct = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { keyword } = validation.validate(req.body, locale).valid({
                keyword: Joi.string().trim().required(),
            });

            const product_list = await productsUseCase.searchProduct({
                keyword,
            });

            return responseHelper.successResponse({
                req,
                res,
                data: product_list,
                message: 'Get list product successfully',
                status_code: 201,
            });
        } catch (e) {
            return next(e);
        }
    };

    const statisticInventory = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const inventory_cache = await cacheHelper.getCache({
                keyword: 'getInventory',
            });

            if (inventory_cache?.length) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: inventory_cache,
                    message: 'Get list of product in inventory successfully',
                    status_code: 201,
                });
            } else {
                const inventory = await productsUseCase.getInventory();

                return responseHelper.successResponse({
                    req,
                    res,
                    data: inventory,
                    message: 'Get list of product in inventory successfully',
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewProduct = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { name, image, price, description, quantity, discount } =
                validation.validate(req.body, locale).valid({
                    name: Joi.string().trim().required(),
                    image: Joi.string().trim().required(),
                    price: Joi.number().required(),
                    description: Joi.string().trim().required(),
                    quantity: Joi.number().required(),
                    discount: Joi.number().required(),
                });

            const newProduct = await productsUseCase.createNewProduct({
                req,
                name,
                image,
                price,
                description,
                quantity,
                discount,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                data: newProduct,
                message: 'Create new product succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateProduct = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, name, image, price, description, quantity, discount } =
                validation.validate(req.body, locale).valid({
                    id: Joi.string().trim().uuid().required(),
                    name: Joi.string().trim(),
                    image: Joi.string().trim(),
                    price: Joi.number(),
                    description: Joi.string().trim(),
                    quantity: Joi.number(),
                    discount: Joi.number(),
                });

            const updatedProduct = await productsUseCase.updateProduct({
                req,
                id,
                name,
                image,
                price,
                description,
                quantity,
                discount,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                data: updatedProduct,
                message: 'Update product succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteProduct = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await productsUseCase.deleteProduct({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete product succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const saleOff = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, start, end } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    start: JoiDate.date()
                        .format('YYYY-MM-DD HH:mm:ss')
                        .required(),
                    end: JoiDate.date()
                        .format('YYYY-MM-DD HH:mm:ss')
                        .required(),
                });

            const start_sale = moment(start).valueOf();
            const end_sale = moment(end).valueOf();

            const updatedProduct = await productsUseCase.saleOff({
                req,
                id,
                start_sale,
                end_sale,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                data: updatedProduct,
                message: 'Sale product succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getBasicInfo,
        getListProduct,
        searchProduct,
        statisticInventory,
        createNewProduct,
        updateProduct,
        deleteProduct,
        saleOff,
    };
};
