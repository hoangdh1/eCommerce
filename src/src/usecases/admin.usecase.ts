import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

const jwt = require('jsonwebtoken');

import bcrypt from 'bcrypt';

const saltRounds = 10;

export const adminsUseCase = (iCradle: ICradle) => {
    const { adminsRepository } = iCradle.repositories;
    const { mailHelper, cacheHelper } = iCradle.helpers;
    const { deleteAcountQueue } = iCradle.setupRedis;

    const getBasicInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const admin_info = await adminsRepository.findAdmin({
            id,
        });

        if (admin_info) {
            await cacheHelper.setCache({ req, data: admin_info });

            return admin_info;
        } else {
            throw new Exception(
                `No information found for admin`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    // Register new user
    const createNewAdmin = async ({
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
            const isEmailExisted = await adminsRepository.findAdmin({
                email,
            });
            // console.log('isEmailExisted email: ', isEmailExisted);
            const isPhoneExisted = await adminsRepository.findAdmin({
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
                await adminsRepository.createAdmin({
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
        email?: string;
        phone?: string;
        password: string;
    }) => {
        if (email || phone) {
            // Check user is existed in database
            const adminWithEmail = await adminsRepository.findOneByFilter({
                email,
            });
            const adminWithPhone = await adminsRepository.findOneByFilter({
                phone,
            });
            const adminFound = adminWithEmail || adminWithPhone;

            if (!adminFound) {
                throw new Exception(
                    `User is not existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                const checkPassword = await bcrypt.compareSync(
                    password,
                    adminFound.password,
                );
                if (!checkPassword) {
                    throw new Exception(
                        `Wrong password`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                } else {
                    const updateAdmin = {
                        ...adminFound,
                        last_login: new Date(),
                    };
                    const updatedAdmin = await adminsRepository.updateAdmin({
                        id: adminFound?.id,
                        update_data: updateAdmin,
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
                        userId: updateAdmin.id,
                        roleUser: 'admin',
                    });

                    await cacheHelper.delCache({ req });

                    return { updatedAdmin, token };
                }
            }
        } else {
            throw new Exception(
                `Please enter email or phone`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const updateAdmin = async ({
        req,
        id,
        username,
        password,
        email,
        phone,
    }: {
        req: ExpressRequest;
        id: string;
        username?: string;
        password?: string;
        email?: string;
        phone?: string;
    }) => {
        const admin = await adminsRepository.findOneByFilter({
            id,
        });

        if (!admin) {
            throw new Exception(
                `Admin is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataAdmin = {
                ...admin,
                username,
                password,
                email,
                phone,
            };
            const updatedAdmin = await adminsRepository.updateAdmin({
                id,
                update_data: updateDataAdmin,
            });

            await cacheHelper.delCache({ req });

            return updatedAdmin;
        }
    };

    const deleteAdmin = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const isAdminExist = await adminsRepository.findOneByFilter({
            id,
        });
        if (!isAdminExist) {
            throw new Exception(
                `Admin is not existed in system`,
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
                return await adminsRepository.destroyParanoidByFilter({
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
        const admin = await adminsRepository.findAdmin({
            email,
        });

        if (!admin) {
            throw new Exception(
                `User with given email doesn't exist`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        const response = await mailHelper.sendEmail({
            id: admin.id,
            username,
            email,
            subject: 'Reset Password',
            text: 'New password',
        });

        if (response?.signal == 0) {
            throw new Exception(
                `Send new password to admin is not successful`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        if (response?.signal == 1) {
            const updatePassWordAdmin = { ...admin, password: 'new password' };
            await adminsRepository.updateAdmin({
                id: admin.id,
                update_data: updatePassWordAdmin,
            });
        }

        await cacheHelper.delCache({ req });
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
