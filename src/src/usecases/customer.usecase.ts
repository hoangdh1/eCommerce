import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

const jwt = require('jsonwebtoken');

import bcrypt from 'bcrypt';

const saltRounds = 10;

export const customersUseCase = (iCradle: ICradle) => {
    const { customersRepository } = iCradle.repositories;
    const { mailHelper, cacheHelper } = iCradle.helpers;
    const { deleteAcountQueue } = iCradle.setupRedis;

    const getBasicInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const customer_info = await customersRepository.findCustomer({
            id,
        });

        if (customer_info) {
            await cacheHelper.setCache({ req, data: customer_info });
        } else {
            throw new Exception(
                `No information found for customer`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    // Register new user
    const createNewCustomer = async ({
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
            const isEmailExisted = await customersRepository.findCustomer({
                email,
            });
            const isPhoneExisted = await customersRepository.findCustomer({
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
                await customersRepository.createCustomer({
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
            const customerWithEmail = await customersRepository.findOneByFilter(
                {
                    email,
                },
            );
            const customerWithPhone = await customersRepository.findOneByFilter(
                {
                    phone,
                },
            );
            const customerFound = customerWithEmail || customerWithPhone;
            if (!customerFound) {
                throw new Exception(
                    `User is not existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                const checkPassword = await bcrypt.compareSync(
                    password,
                    customerFound.password,
                );
                if (!checkPassword) {
                    throw new Exception(
                        `Wrong password`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                } else {
                    const customerExisted = customerFound;

                    const updateCustomer = {
                        ...customerExisted,
                        last_login: new Date(),
                    };
                    const updatedCustomer =
                        await customersRepository.updateCustomer({
                            id: customerExisted?.id,
                            update_data: updateCustomer,
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
                        userId: updateCustomer.id,
                        roleUser: 'customer',
                    });

                    await cacheHelper.delCache({ req });

                    return { updatedCustomer, token };
                }
            }
        } else {
            throw new Exception(
                `Please enter email or phone`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const updateCustomer = async ({
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
        const customer = await customersRepository.findOneByFilter({
            id,
        });

        if (!customer) {
            throw new Exception(
                `Customer is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataCustomer = {
                ...customer,
                username,
                password,
                email,
                phone,
            };
            const updatedCustomer = await customersRepository.updateCustomer({
                id,
                update_data: updateDataCustomer,
            });

            await cacheHelper.delCache({ req });

            return updatedCustomer;
        }
    };

    const deleteCustomer = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const isCustomerExist = await customersRepository.findOneByFilter({
            id,
        });
        if (!isCustomerExist) {
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
                return await customersRepository.destroyParanoidByFilter({
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
        const customer = await customersRepository.findCustomer({
            email,
        });

        if (!customer) {
            throw new Exception(
                `User with given email doesn't exist`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        const response = await mailHelper.sendEmail({
            id: customer.id,
            username,
            email,
            subject: 'Reset Password',
            text: 'New password',
        });

        if (response?.signal == 0) {
            throw new Exception(
                `Send new password to customer is not successful`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (response?.signal == 1) {
            const updatePassWordCustomer = {
                ...customer,
                password: 'new password',
            };
            await customersRepository.updateCustomer({
                id: customer.id,
                update_data: updatePassWordCustomer,
            });
        }

        await cacheHelper.delCache({ req });
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
