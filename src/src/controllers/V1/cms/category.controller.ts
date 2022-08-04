import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const categoriesController = ({ useCases, helpers }: ICradle) => {
    const { categoriesUseCase } = useCases;
    const { validation, responseHelper, cacheHelper } = helpers;

    const getCategoryInfo = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const categoryCache = await cacheHelper.getCache({ req });

            if (categoryCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: categoryCache,
                    status_code: 201,
                });
            } else {
                const category_info = await categoriesUseCase.getCategoryInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: category_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewCategory = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { name } = validation.validate(req.body, locale).valid({
                name: Joi.string().trim().required(),
            });

            await categoriesUseCase.createNewCategory({
                req,
                name,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new category succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateCategory = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, name } = validation.validate(req.body, locale).valid({
                id: Joi.string().trim().uuid().required(),
                name: Joi.string().trim().required(),
            });

            const updatedCategory = await categoriesUseCase.updateCategory({
                req,
                id,
                name,
            });
            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update category succeed',
                data: updatedCategory,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteCategory = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await categoriesUseCase.deleteCategory({
                req,
                id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete category succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getCategoryInfo,
        createNewCategory,
        updateCategory,
        deleteCategory,
    };
};
