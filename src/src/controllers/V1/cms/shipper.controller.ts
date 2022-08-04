import { ICradle } from 'src/container';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import Joi from 'joi';

export const shippersController = ({ useCases, helpers }: ICradle) => {
    const { shippersUseCase } = useCases;
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

            const shipperCache = await cacheHelper.getCache({ req });

            if (shipperCache) {
                return responseHelper.successResponse({
                    req,
                    res,
                    data: shipperCache,
                    status_code: 201,
                });
            } else {
                const shipper_info = await shippersUseCase.getBasicInfo({
                    req,
                    id,
                });
                return responseHelper.successResponse({
                    req,
                    res,
                    data: shipper_info,
                    status_code: 201,
                });
            }
        } catch (e) {
            return next(e);
        }
    };

    const createNewShipper = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            // console.log('check role from shipper controller: ', req.body.role);
            const locale = 'VI';

            const { username, password, email, phone } = validation
                .validate(req.body, locale)
                .valid({
                    username: Joi.string().trim().required(),
                    password: Joi.string().trim().required(),
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                });

            await shippersUseCase.createNewShipper({
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
                message: 'Create a new shipper succeed',
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

            const { updatedShipper, token } = await shippersUseCase.login({
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
                data: updatedShipper,
                token,
            });
        } catch (e) {
            return next(e);
        }
    };

    const updateShipper = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id, username, password, email, phone, status } = validation
                .validate(req.body, locale)
                .valid({
                    id: Joi.string().trim().uuid().required(),
                    username: Joi.string().trim(),
                    password: Joi.string().trim(),
                    email: Joi.string().trim(),
                    phone: Joi.string().trim(),
                    status: Joi.string().trim(),
                });

            const updatedShipper = await shippersUseCase.updateShipper({
                req,
                id,
                username,
                password,
                email,
                phone,
                status,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Update shipper succeed',
                data: updatedShipper,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deactiveShipper = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            const updatedShipper = await shippersUseCase.deactiveShipper({
                req,
                id,
            });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Deactive shipper succeed',
                data: updatedShipper,
            });
        } catch (e) {
            return next(e);
        }
    };

    const deleteShipper = async (
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const locale = 'VI';

            const { id } = validation.validate(req.query, locale).valid({
                id: Joi.string().trim().uuid().required(),
            });

            await shippersUseCase.deleteShipper({ req, id });

            return responseHelper.successResponse({
                req,
                res,
                status_code: 201,
                message: 'Delete shipper succeed',
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

            await shippersUseCase.sendEmail({
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
        createNewShipper,
        login,
        updateShipper,
        deactiveShipper,
        deleteShipper,
        sendEmail,
    };
};
