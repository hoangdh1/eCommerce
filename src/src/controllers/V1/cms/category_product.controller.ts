import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const cateProdsController = ({ useCases, helpers }: ICradle) => {
    const { cateProdsUseCase } = useCases;
    const { validation, responseHelper, cacheHelper } = helpers;

    const getCateProdInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const cateProdCache = await cacheHelper.getCache({ req });

            if (cateProdCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: cateProdCache,
                    status_code: 201,
                });
            } else {
                const cate_prod_info = await cateProdsUseCase.getCateProdInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: cate_prod_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewCateProd = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { category_id, product_id } = validation
                .validate(req.body, locale)
                .valid({
                    category_id: Joi.string().trim().uuid().required(),
                    product_id: Joi.string().trim().uuid().required(),
                });

            await cateProdsUseCase.createNewCateProd({
                req,
                category_id,
                product_id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new cate prod succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateCateProd = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, category_id, product_id } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    category_id: Joi.string().trim().uuid(),
                    product_id: Joi.string().trim().uuid(),
                });

            const updatedCateProd = await cateProdsUseCase.updateCateProd({
                req,
                id,
                category_id,
                product_id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update cate prod succeed',
                data: updatedCateProd,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteCateProd = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await cateProdsUseCase.deleteCateProd({
                req,
                id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete cate prod succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getCateProdInfo,
        createNewCateProd,
        updateCateProd,
        deleteCateProd,
    };
};
