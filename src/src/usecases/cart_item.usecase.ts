import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const cartItemsUseCase = (iCradle: ICradle) => {
    const { cartItemsRepository, cartsRepository, productsRepository } =
        iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getCartItemInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const cart_item_info = await cartItemsRepository.findOneByFilter({
            id,
        });

        if (cart_item_info) {
            await cacheHelper.setCache({ req, data: cart_item_info });

            return cart_item_info;
        } else {
            throw new Exception(
                `No information found for admin`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewCartItem = async ({
        req,
        cart_id,
        product_id,
        count,
    }: {
        req: ExpressRequest;
        cart_id: string;
        product_id: string;
        count: number;
    }) => {
        const isCartExist = await cartsRepository.findOneByFilter({
            id: cart_id,
        });

        if (!isCartExist) {
            throw new Exception(
                `Cart doesn't exist, can't create cart item`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const isProductExist = await productsRepository.findOneByFilter({
            id: product_id,
        });
        if (!isProductExist) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (isProductExist.quantity < 1) {
            throw new Exception(
                `This product is out of stock`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        // Update data of the cart
        const new_total = isCartExist.total + isProductExist.price * count;
        const updateDataCart = {
            ...isCartExist,
            total: new_total,
        };
        await cartsRepository.updateCart({
            id: cart_id,
            update_data: updateDataCart,
        });

        // Create cart item
        await cartItemsRepository.createCartItem({
            cart_id,
            product_id,
            count,
        });

        await cacheHelper.delCache({ req });
    };

    const updateCartItem = async ({
        req,
        id,
        count,
    }: {
        req: ExpressRequest;
        id: string;
        count: number;
    }) => {
        const cartItem = await cartItemsRepository.findOneByFilter({
            id,
        });

        if (!cartItem) {
            throw new Exception(
                `Cart item is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            // Update data of the cart
            const isCartExist = await cartsRepository.findOneByFilter({
                id: cartItem.cart_id,
            });
            if (!isCartExist) {
                throw new Exception(
                    `Cart is not existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }
            const isProductExist = await productsRepository.findOneByFilter({
                id: cartItem.product_id,
            });
            if (!isProductExist) {
                throw new Exception(
                    `Product is not existed in system`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }
            const new_total =
                isCartExist.total - isProductExist.price * cartItem.count;
            const updateDataCart = {
                ...isCartExist,
                total: new_total,
            };
            await cartsRepository.updateCart({
                id: cartItem.cart_id,
                update_data: updateDataCart,
            });

            // Updata data of cart item
            const updateDataCartItem = {
                ...cartItem,
                count,
            };
            const updatedCartItem = await cartItemsRepository.updateCartItem({
                id,
                update_data: updateDataCartItem,
            });

            await cacheHelper.delCache({ req });

            return updatedCartItem;
        }
    };

    const deleteCartItem = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const cartItem = await cartItemsRepository.findOneByFilter({
            id,
        });
        if (!cartItem) {
            throw new Exception(
                `Cart item is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        await cartItemsRepository.destroyParanoidByFilter({
            id,
        });

        await cacheHelper.delCache({ req });

        // Update data of the cart
        const isCartExist = await cartsRepository.findOneByFilter({
            id: cartItem.cart_id,
        });
        if (!isCartExist) {
            throw new Exception(
                `Cart is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const isProductExist = await productsRepository.findOneByFilter({
            id: cartItem.product_id,
        });
        if (!isProductExist) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const new_total =
            isCartExist?.total - isProductExist?.price * cartItem.count;
        const updateDataCart = {
            ...isCartExist,
            total: new_total,
        };
        await cartsRepository.updateCart({
            id: cartItem.cart_id,
            update_data: updateDataCart,
        });
    };

    return {
        getCartItemInfo,
        createNewCartItem,
        updateCartItem,
        deleteCartItem,
    };
};
