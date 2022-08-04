import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const adminsController = ({ useCases, helpers }: ICradle) => {
    const { adminsUseCase } = useCases;
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

            const adminCache = await cacheHelper.getCache({ req });

            if (adminCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: adminCache,
                    status_code: 201,
                });
            } else {
                const admin_info = await adminsUseCase.getBasicInfo({
                    req,
                    id,
                });
                return responseHelper.successResponse({
                    req,
                    res,
                    data: admin_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewAdmin = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { username, password, email, phone } = validation
                .validate(req.body, locale)
                .valid({
                    username: Joi.string().trim().required(),
                    password: Joi.string().trim().required(),
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                });

            await adminsUseCase.createNewAdmin({
                req,
                username,
                password,
                email,
                phone,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Create a new admin succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const login = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { email, phone, password } = validation
                .validate(req.body, locale)
                .valid({
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                    password: Joi.string().trim().required(),
                });

            const { updatedAdmin, token } = await adminsUseCase.login({
                req,
                email,
                phone,
                password,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Login succeed',
                data: updatedAdmin,
                token,
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateAdmin = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, username, password, email, phone } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    username: Joi.string().trim(),
                    password: Joi.string().trim(),
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                });

            const updatedAdmin = await adminsUseCase.updateAdmin({
                req,
                id,
                username,
                password,
                email,
                phone,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update admin succeed',
                data: updatedAdmin,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteAdmin = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await adminsUseCase.deleteAdmin({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete admin succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    const sendEmail = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { username, email } = validation
                .validate(req.body, locale)
                .valid({
                    username: Joi.string().trim().required(),
                    email: Joi.string().trim().required(),
                });

            await adminsUseCase.sendEmail({ req, username, email });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Send email to admin succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getBasicInfo,
        createNewAdmin,
        login,
        updateAdmin,
        deleteAdmin,
        sendEmail,
    };
};
