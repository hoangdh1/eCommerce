import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const orderItemsUseCase = (iCradle: ICradle) => {
    const { orderItemsRepository, ordersRepository, productsRepository } =
        iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getOrderItemInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const order_item_info = await orderItemsRepository.findOneByFilter({
            id,
        });

        if (order_item_info) {
            await cacheHelper.setCache({ req, data: order_item_info });

            return order_item_info;
        } else {
            throw new Exception(
                `No information found for order item`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const getBestSelling = async ({ day_format }: { day_format: String }) => {
        const best_selling = await orderItemsRepository.getBestSelling({
            day_format,
        });

        // console.log('check data get from repo in usecase: ', best_selling);

        if (best_selling) {
            await cacheHelper.setCache({
                keyword: 'getBestSelling',
                data: best_selling,
            });

            return best_selling;
        } else {
            throw new Exception(
                `No information found about best selling`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewOrderItem = async ({
        req,
        order_id,
        product_id,
        count,
    }: {
        req: ExpressRequest;
        order_id: string;
        product_id: string;
        count: number;
    }) => {
        const isOrderExist = await ordersRepository.findOneByFilter({
            id: order_id,
        });
        if (!isOrderExist) {
            throw new Exception(
                `Order is not existed in system, can't create new order item`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const isProductExist = await productsRepository.findOneByFilter({
            id: product_id,
        });
        if (!isProductExist) {
            throw new Exception(
                `Product is not existed in system, can't create new order item`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (isProductExist.quantity < 1) {
            throw new Exception(
                `This product is out of stock`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        // Update data of the product
        const new_quantity = isProductExist.quantity - count;
        const updateDataProduct = {
            ...isProductExist,
            quantity: new_quantity,
        };
        await productsRepository.updateProduct({
            id: product_id,
            update_data: updateDataProduct,
        });

        // Update data of the order
        const new_total = isOrderExist.total + isProductExist.price * count;
        const updateDataOrder = {
            ...isOrderExist,
            total: new_total,
        };
        await ordersRepository.updateOrder({
            id: order_id,
            update_data: updateDataOrder,
        });

        // Create new order item
        await orderItemsRepository.createOrderItem({
            order_id,
            product_id,
            count,
        });

        await cacheHelper.delCache({ req });
    };

    const updateOrderItem = async ({
        req,
        id,
        order_id,
        product_id,
        count,
    }: {
        req: ExpressRequest;
        id: string;
        order_id: string;
        product_id: string;
        count: number;
    }) => {
        const orderItem = await orderItemsRepository.findOneByFilter({
            id,
        });

        if (!orderItem) {
            throw new Exception(
                `Order item is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        // Updata data of the product
        const isProductExist = await productsRepository.findOneByFilter({
            id: orderItem.product_id,
        });
        if (!isProductExist) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const new_quantity =
            isProductExist.quantity - (count - orderItem.count);
        const updateDataProduct = {
            ...isProductExist,
            quantity: new_quantity,
        };
        await productsRepository.updateProduct({
            id: orderItem.product_id,
            update_data: updateDataProduct,
        });

        // Update data of the order
        const isOrderExist = await ordersRepository.findOneByFilter({
            id: orderItem.order_id,
        });
        if (!isOrderExist) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const new_total =
            isOrderExist.total - isProductExist.price * orderItem.count;
        const updateDataOrder = {
            ...isOrderExist,
            total: new_total,
        };
        await ordersRepository.updateOrder({
            id: orderItem.order_id,
            update_data: updateDataOrder,
        });

        // Updata data of order item
        const updateDataOrderItem = {
            ...orderItem,
            order_id,
            product_id,
            count,
        };
        const updatedOrderItem = await orderItemsRepository.updateOrderItem({
            id,
            update_data: updateDataOrderItem,
        });

        await cacheHelper.delCache({ req });

        return updatedOrderItem;
    };

    const deleteOrderItem = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const orderItem = await orderItemsRepository.findOneByFilter({
            id,
        });
        if (!orderItem) {
            throw new Exception(
                `Order item is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        await orderItemsRepository.destroyParanoidByFilter({
            id,
        });

        await cacheHelper.delCache({ req });

        // Updata data of the product
        const isProductExist = await productsRepository.findOneByFilter({
            id: orderItem.product_id,
        });
        if (!isProductExist) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const new_quantity = isProductExist.quantity + orderItem.count;
        const updateDataProduct = {
            ...isProductExist,
            quantity: new_quantity,
        };
        await productsRepository.updateProduct({
            id: orderItem.product_id,
            update_data: updateDataProduct,
        });

        // Update data of the order
        const isOrderExist = await ordersRepository.findOneByFilter({
            id: orderItem.order_id,
        });
        if (!isOrderExist) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const new_total =
            isOrderExist?.total - isProductExist?.price * orderItem.count;
        const updateDataOrder = {
            ...isOrderExist,
            total: new_total,
        };
        await ordersRepository.updateOrder({
            id: orderItem.order_id,
            update_data: updateDataOrder,
        });
    };

    return {
        getOrderItemInfo,
        getBestSelling,
        createNewOrderItem,
        updateOrderItem,
        deleteOrderItem,
    };
};
