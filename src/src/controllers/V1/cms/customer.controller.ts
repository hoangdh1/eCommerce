import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const customersController = ({ useCases, helpers }: ICradle) => {
    const { customersUseCase } = useCases;
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

            const customerCache = await cacheHelper.getCache({ req });

            if (customerCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: customerCache,
                    status_code: 201,
                });
            } else {
                const customer_info = await customersUseCase.getBasicInfo({
                    req,
                    id,
                });

                return responseHelper.successResponse({
                    req,
                    res,
                    data: customer_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewCustomer = async (
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

            await customersUseCase.createNewCustomer({
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
                message: 'Create a new customer succeed',
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

            const { updatedCustomer, token } = await customersUseCase.login({
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
                data: updatedCustomer,
                token,
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateCustomer = async (
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

            const updatedCustomer = await customersUseCase.updateCustomer({
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
                message: 'Update customer succeed',
                data: updatedCustomer,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteCustomer = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await customersUseCase.deleteCustomer({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete customer succeed',
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

            await customersUseCase.sendEmail({
                req,
                username,
                email,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Send email to customer succeed',
            });
        } catch (e) {
            return next(e);
        }
    };

    return {
        getBasicInfo,
        createNewCustomer,
        login,
        updateCustomer,
        deleteCustomer,
        sendEmail,
    };
};
