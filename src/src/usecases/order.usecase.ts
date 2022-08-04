import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const ordersUseCase = (iCradle: ICradle) => {
    const { ordersRepository, customersRepository, shippersRepository } =
        iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getOrderInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const order_info = await ordersRepository.findOneByFilter({
            id,
        });

        if (order_info) {
            await cacheHelper.setCache({ req, data: order_info });

            return order_info;
        } else {
            throw new Exception(
                `No information found for the order`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const getOrderList = async ({ shipper_id }: { shipper_id: string }) => {
        const shipper = await shippersRepository.findOneByFilter({
            id: shipper_id,
        });
        if (!shipper) {
            throw new Exception(
                `Don't exist shipper in the system `,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (shipper.status == 'disabled') {
            throw new Exception(
                `Shipper is disabled`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const order_list = await ordersRepository.findAllByFilter({
            shipper_id,
        });

        // console.log('check order list: ', order_list);

        if (order_list) {
            await cacheHelper.setCache({
                keyword: `order_list_${shipper_id}`,
                data: order_list,
            });

            return order_list;
        } else {
            throw new Exception(
                `No information found for the order list`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewOrder = async ({
        req,
        customer_id,
        shipper_id,
    }: {
        req: ExpressRequest;
        customer_id: string;
        shipper_id: string;
    }) => {
        const isCustomerExist = await customersRepository.findOneByFilter({
            id: customer_id,
        });
        if (!isCustomerExist) {
            throw new Exception(
                `Customer is not existed`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const isShipperExist = await shippersRepository.findOneByFilter({
                id: shipper_id,
            });
            if (!isShipperExist) {
                throw new Exception(
                    `Shipper is not existed`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                await ordersRepository.createOrder({
                    customer_id,
                    shipper_id,
                });

                await cacheHelper.delCache({ req });
                await cacheHelper.delCache({
                    keyword: `order_list_${shipper_id}`,
                });
            }
        }
    };

    const updateOrder = async ({
        req,
        id,
        customer_id,
        shipper_id,
        total,
        status,
    }: {
        req: ExpressRequest;
        id: string;
        customer_id: string;
        shipper_id: string;
        total: number;
        status: string;
    }) => {
        const order = await ordersRepository.findOneByFilter({
            id,
        });

        if (!order) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataOrder = {
                ...order,
                customer_id,
                shipper_id,
                total,
                status,
            };
            const updatedOrder = await ordersRepository.updateOrder({
                id,
                update_data: updateDataOrder,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({
                keyword: `order_list_${shipper_id}`,
            });

            return updatedOrder;
        }
    };

    const exportOrder = async ({
        req,
        id,
        status,
    }: {
        req: ExpressRequest;
        id: string;
        status: string;
    }) => {
        const order = await ordersRepository.findOneByFilter({
            id,
        });

        if (!order) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (order.status !== 'inStock') {
            throw new Exception(
                `Order is not in stock, admin can not change status of the order`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (status !== 'exported') {
            throw new Exception(
                `Admin only can change status of order to exported`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        const updateDataOrder = {
            ...order,
            status,
        };
        const updatedOrder = await ordersRepository.updateOrder({
            id,
            update_data: updateDataOrder,
        });

        await cacheHelper.delCache({ req });
        await cacheHelper.delCache({
            keyword: `order_list_${order.shipper_id}`,
        });

        return updatedOrder;
    };

    const assignShipper = async ({
        req,
        id,
        shipper_id,
    }: {
        req: ExpressRequest;
        id: string;
        shipper_id: string;
    }) => {
        // Check order is existed
        const order = await ordersRepository.findOneByFilter({
            id,
        });

        if (!order) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
        if (order.status !== 'exported') {
            throw new Exception(
                `The status of order is not exported, admin can not assign shipper for the order`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }

        // Check shipper is available
        const shipper = await shippersRepository.findOneByFilter({
            id: shipper_id,
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
        const updateDataOrder = {
            ...order,
            shipper_id,
        };
        const updatedOrder = await ordersRepository.updateOrder({
            id,
            update_data: updateDataOrder,
        });

        await cacheHelper.delCache({ req });
        await cacheHelper.delCache({
            keyword: `order_list_${shipper_id}`,
        });

        return updatedOrder;
    };

    const updateStatusOrder = async ({
        req,
        id,
        shipper_id,
        status,
    }: {
        req: ExpressRequest;
        id: string;
        shipper_id: string;
        status: string;
    }) => {
        const shipper = await shippersRepository.findOneByFilter({
            id: shipper_id,
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
        const order = await ordersRepository.findOneByFilter({
            id,
        });

        if (!order) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            if (order.status == 'inStock') {
                throw new Exception(
                    `Order is in stock, shipper can not change status of the order`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }
            if (order.status == 'exported') {
                if (status !== 'shipped') {
                    throw new Exception(
                        `Order is exported, shipper must change status to shipped before change another status of the order`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                }
            }
            const updateDataOrder = {
                ...order,
                status,
            };
            const updatedOrder = await ordersRepository.updateOrder({
                id,
                update_data: updateDataOrder,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({
                keyword: `order_list_${shipper_id}`,
            });

            return updatedOrder;
        }
    };

    const deleteOrder = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const order = await ordersRepository.findOneByFilter({
            id,
        });
        if (!order) {
            throw new Exception(
                `Order is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await ordersRepository.destroyParanoidByFilter({
                id,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({
                keyword: `order_list_${order.shipper_id}`,
            });
        }
    };

    return {
        getOrderInfo,
        getOrderList,
        createNewOrder,
        updateOrder,
        exportOrder,
        assignShipper,
        updateStatusOrder,
        deleteOrder,
    };
};
