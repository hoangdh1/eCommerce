import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';
const jwt = require('jsonwebtoken');

import bcrypt from 'bcrypt';

const saltRounds = 10;

export const shippersUseCase = (iCradle: ICradle) => {
    const { shippersRepository } = iCradle.repositories;
    const { mailHelper, cacheHelper } = iCradle.helpers;
    const { deleteAcountQueue } = iCradle.setupRedis;

    const getBasicInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const shipper_info = await shippersRepository.findShipper({
            id,
        });

        if (shipper_info) {
            await cacheHelper.setCache({ req, data: shipper_info });

            return shipper_info;
        } else {
            throw new Exception(
                `No information found for shipper`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    // Register new user
    const createNewShipper = async ({
        req,
        username,
        password,
        email,
        phone,
    }: {
        req: ExpressRequest;
        username: string;
        password: string;
        email: string;
        phone: string;
    }) => {
        // Create new user
        if (email || phone) {
            // Check user is existed in database
            const isEmailExisted = await shippersRepository.findShipper({
                email,
            });
            const isPhoneExisted = await shippersRepository.findShipper({
                phone,
            });
            if (isEmailExisted || isPhoneExisted) {
                throw new Exception(
                    `User is existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                const salt = await bcrypt.genSaltSync(saltRounds);
                const hash = await bcrypt.hashSync(password, salt);
                // Store hash in your password DB.
                await shippersRepository.createShipper({
                    username,
                    password: hash,
                    email,
                    phone,
                });

                await cacheHelper.delCache({ req });
            }
        } else {
            throw new Exception(
                `Please enter email or password`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const login = async ({
        req,
        email,
        phone,
        password,
    }: {
        req: ExpressRequest;
        email: string;
        phone: string;
        password: string;
    }) => {
        if (email || phone) {
            // Check user is existed in database
            const shipperWithEmail = await shippersRepository.findOneByFilter({
                email,
            });
            const shipperWithPhone = await shippersRepository.findOneByFilter({
                phone,
            });
            const shipperFound = shipperWithEmail || shipperWithPhone;
            // console.log('shipperFound', shipperFound);
            if (!shipperFound) {
                throw new Exception(
                    `User is not existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                // console.log(password, shipperFound.password);
                const checkPassword = await bcrypt.compareSync(
                    password,
                    shipperFound.password,
                );
                if (!checkPassword) {
                    throw new Exception(
                        `Wrong password`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                } else {
                    const shipperExisted = shipperFound;

                    const updateShipper = {
                        ...shipperExisted,
                        last_login: new Date(),
                    };
                    const updatedShipper =
                        await shippersRepository.updateShipper({
                            id: shipperExisted?.id,
                            update_data: updateShipper,
                        });

                    // Create token
                    function generateAccessToken({ userId, roleUser }) {
                        return jwt.sign(
                            { userId, roleUser },
                            process.env.TOKEN_SECRET,
                            {
                                expiresIn: '1d',
                            },
                        );
                    }

                    const token = generateAccessToken({
                        userId: updateShipper.id,
                        roleUser: 'shipper',
                    });

                    await cacheHelper.delCache({ req });

                    return { updatedShipper, token };
                }
            }
        } else {
            throw new Exception(
                `Please enter email or phone`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const updateShipper = async ({
        req,
        id,
        username,
        password,
        email,
        phone,
        status,
    }: {
        req: ExpressRequest;
        id: string;
        username?: string;
        password?: string;
        email?: string;
        phone?: string;
        status?: string;
    }) => {
        const shipper = await shippersRepository.findOneByFilter({
            id,
        });

        if (!shipper) {
            throw new Exception(
                `Shipper is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataShipper = {
                ...shipper,
                username,
                password,
                email,
                phone,
                status,
            };
            const updatedShipper = await shippersRepository.updateShipper({
                id,
                update_data: updateDataShipper,
            });

            await cacheHelper.delCache({ req });

            return updatedShipper;
        }
    };

    const deactiveShipper = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const shipper = await shippersRepository.findOneByFilter({
            id,
        });

        if (!shipper) {
            throw new Exception(
                `Shipper is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        if (shipper.status == 'disabled') {
            throw new Exception(
                `Shipper is disabled`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        const updateDataShipper = {
            ...shipper,
            status: 'disabled',
        };
        const updatedShipper = await shippersRepository.updateShipper({
            id,
            update_data: updateDataShipper,
        });

        await cacheHelper.delCache({ req });

        return updatedShipper;
    };

    const deleteShipper = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const isShipperExist = await shippersRepository.findOneByFilter({
            id,
        });
        if (!isShipperExist) {
            throw new Exception(
                `Shipper is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const data = { id };

            const options = {
                delay: 60000 * 60 * 24 * 7, // delete after 7 days
                attempts: 2,
            };
            // Adding a Job to the Queue
            deleteAcountQueue.add(data, options);

            deleteAcountQueue.process(async job => {
                return await shippersRepository.destroyParanoidByFilter({
                    id: job.data.id,
                });
            });

            await cacheHelper.delCache({ req });
        }
    };

    const sendEmail = async ({
        req,
        username,
        email,
    }: {
        req: ExpressRequest;
        username: string;
        email: string;
    }) => {
        const shipper = await shippersRepository.findShipper({
            email,
        });

        if (!shipper) {
            throw new Exception(
                `User with given email doesn't exist`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        const response = await mailHelper.sendEmail({
            id: shipper.id,
            username,
            email,
            subject: 'Reset Password',
            text: 'New password',
        });

        if (response?.signal == 0) {
            throw new Exception(
                `Send new password to shipper is not successful`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (response?.signal == 1) {
            const updatePassWordShipper = {
                ...shipper,
                password: 'new password',
            };
            await shippersRepository.updateShipper({
                id: shipper.id,
                update_data: updatePassWordShipper,
            });
        }

        await cacheHelper.delCache({ req });
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
