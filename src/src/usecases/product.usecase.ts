import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';
import moment from 'moment-timezone';

export const productsUseCase = (iCradle: ICradle) => {
    const { productsRepository } = iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;
    const { saleOffQueue, endSaleQueue } = iCradle.setupRedis;

    const getBasicInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const product_info = await productsRepository.findOneByFilter({
            id,
        });

        if (product_info) {
            await cacheHelper.setCache({ req, data: product_info });

            return product_info;
        } else {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const getListProduct = async ({
        limit,
        offset,
    }: {
        limit: number;
        offset: number;
    }) => {
        const product_list = await productsRepository.getListProduct({
            limit,
            offset,
        });

        if (product_list) {
            await cacheHelper.setCache({
                keyword: 'getListProduct',
                data: product_list,
            });

            return product_list;
        } else {
            throw new Exception(
                `No product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const searchProduct = async ({ keyword }: { keyword: string }) => {
        const product_list = await productsRepository.searchProduct({
            keyword,
        });

        // console.log('check product_list', product_list);

        if (product_list) {
            return product_list;
        } else {
            throw new Exception(
                `No product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const getInventory = async () => {
        const product_inventory = await productsRepository.getInventory();

        if (product_inventory) {
            await cacheHelper.setCache({
                keyword: 'getInventory',
                data: product_inventory,
            });

            return product_inventory;
        } else {
            throw new Exception(
                `No product is in inventory`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewProduct = async ({
        req,
        name,
        image,
        price,
        description,
        quantity,
        discount,
    }: {
        req: ExpressRequest;
        name: string;
        image: string;
        price: number;
        description: string;
        quantity: number;
        discount: number;
    }) => {
        const isProductExisted = await productsRepository.findOneByFilter({
            name,
        });
        if (isProductExisted) {
            throw new Exception(
                `Product is existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const newProduct = await productsRepository.createProduct({
                name,
                image,
                price,
                description,
                quantity,
                discount,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({ keyword: 'getListProduct' });
            await cacheHelper.delCache({ keyword: 'getInventory' });

            return newProduct;
        }
    };

    const updateProduct = async ({
        req,
        id,
        name,
        image,
        price,
        description,
        quantity,
        discount,
    }: {
        req: ExpressRequest;
        id: string;
        name?: string;
        image?: string;
        price?: number;
        description?: string;
        quantity?: number;
        discount?: number;
    }) => {
        const product = await productsRepository.findOneByFilter({
            id,
        });
        if (!product) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataProduct = {
                ...product,
                name,
                image,
                price,
                description,
                quantity,
                discount,
            };
            const updatedProduct = await productsRepository.updateProduct({
                id,
                update_data: updateDataProduct,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({ keyword: 'getListProduct' });
            await cacheHelper.delCache({ keyword: 'getInventory' });

            return updatedProduct;
        }
    };

    const deleteProduct = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const product = await productsRepository.findOneByFilter({
            id,
        });
        if (!product) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await productsRepository.destroyParanoidByFilter({
                id,
            });

            await cacheHelper.delCache({ req });
            await cacheHelper.delCache({ keyword: 'getListProduct' });
            await cacheHelper.delCache({ keyword: 'getInventory' });
        }
    };

    const saleOff = async ({
        req,
        id,
        start_sale,
        end_sale,
    }: {
        req: ExpressRequest;
        id: string;
        start_sale: number;
        end_sale: number;
    }) => {
        const product = await productsRepository.findOneByFilter({
            id,
        });
        if (!product) {
            throw new Exception(
                `Product is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const data = { id, product };

            const now = moment().valueOf();
            const now_to_start = start_sale - now;
            const now_to_end = end_sale - now;

            if (now_to_start < 0) {
                throw new Exception(
                    `Time start to sale is invalid`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }

            if (now_to_start > now_to_end) {
                throw new Exception(
                    `Time start and end to sale is invalid`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }

            const options = {
                delay: now_to_start,
                attempts: 2,
            };
            // Adding a Job to the Queue
            saleOffQueue.add(data, options);

            saleOffQueue.process(async job => {
                const product = job.data.product;

                const updateDataProduct = {
                    ...product,
                    price: Math.floor(
                        (product.price * (100 - product.discount)) / 100,
                    ),
                };
                const updatedProduct = await productsRepository.updateProduct({
                    id: job.data.id,
                    update_data: updateDataProduct,
                });

                await cacheHelper.delCache({ req });
                await cacheHelper.delCache({ keyword: 'getListProduct' });
                await cacheHelper.delCache({ keyword: 'getInventory' });

                return updatedProduct;
            });

            // Update product after end sale off
            const options_end = {
                delay: now_to_end,
                attempts: 2,
            };
            // Adding a Job to the Queue
            endSaleQueue.add(data, options_end);

            endSaleQueue.process(async job => {
                const product = job.data.product;

                const updateDataProduct = {
                    ...product,
                    price: product.price,
                };
                const updatedProduct = await productsRepository.updateProduct({
                    id: job.data.id,
                    update_data: updateDataProduct,
                });

                await cacheHelper.delCache({ req });
                await cacheHelper.delCache({ keyword: 'getListProduct' });
                await cacheHelper.delCache({ keyword: 'getInventory' });

                return updatedProduct;
            });
        }
    };

    return {
        getBasicInfo,
        getListProduct,
        searchProduct,
        getInventory,
        createNewProduct,
        updateProduct,
        deleteProduct,
        saleOff,
    };
};
