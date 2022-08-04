import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const cartsUseCase = (iCradle: ICradle) => {
    const { cartsRepository, customersRepository } = iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getBasicInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const cart_info = await cartsRepository.findOneByFilter({
            id,
        });

        if (cart_info) {
            await cacheHelper.setCache({ req, data: cart_info });

            return cart_info;
        } else {
            throw new Exception(
                `Cart is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewCart = async ({
        req,
        customer_id,
    }: {
        req: ExpressRequest;
        customer_id: string;
    }) => {
        // Check customer is existed
        const isCustomerExist = await customersRepository.findOneByFilter({
            id: customer_id,
        });

        if (!isCustomerExist) {
            throw new Exception(
                `Customer doesn't exist, can't create cart`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            // Check cart is existed in database
            const isCartExist = await cartsRepository.findOneByFilter({
                customer_id,
            });
            if (isCartExist) {
                throw new Exception(
                    `Cart is existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                await cartsRepository.createCart({
                    customer_id,
                });

                await cacheHelper.delCache({ req });
            }
        }
    };

    const updateCart = async ({
        req,
        id,
        total,
    }: {
        req: ExpressRequest;
        id: string;
        total: number;
    }) => {
        const cart = await cartsRepository.findOneByFilter({
            id,
        });

        if (!cart) {
            throw new Exception(
                `Cart is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataCart = {
                ...cart,
                total,
            };
            const updatedCart = await cartsRepository.updateCart({
                id,
                update_data: updateDataCart,
            });

            await cacheHelper.delCache({ req });

            return updatedCart;
        }
    };

    const deleteCart = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const isCartExist = await cartsRepository.findOneByFilter({ id });
        if (!isCartExist) {
            throw new Exception(
                `Cart is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await cartsRepository.destroyParanoidByFilter({
                id,
            });

            await cacheHelper.delCache({ req });
        }
    };

    return {
        getBasicInfo,
        createNewCart,
        updateCart,
        deleteCart,
    };
};
