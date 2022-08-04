import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const cateProdsUseCase = (iCradle: ICradle) => {
    const { cateProdsRepository, categoriesRepository, productsRepository } =
        iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getCateProdInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const cate_prod_info = await cateProdsRepository.findOneByFilter({
            id,
        });

        if (cate_prod_info) {
            await cacheHelper.setCache({ req, data: cate_prod_info });

            return cate_prod_info;
        } else {
            throw new Exception(
                `No information found for cate prod`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewCateProd = async ({
        req,
        category_id,
        product_id,
    }: {
        req: ExpressRequest;
        category_id: string;
        product_id: string;
    }) => {
        const isCategoryExist = await categoriesRepository.findOneByFilter({
            id: category_id,
        });
        if (!isCategoryExist) {
            throw new Exception(
                `Category is not existed in system, can't create new cate prod`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const isProductExist = await productsRepository.findOneByFilter({
                id: product_id,
            });
            if (!isProductExist) {
                throw new Exception(
                    `Product is not existed in system, cant create new cate prod`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            } else {
                const isCateProdExist =
                    await cateProdsRepository.findOneByFilter({
                        category_id,
                        product_id,
                    });
                if (isCateProdExist) {
                    throw new Exception(
                        `Cate prod is exist in the system`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                } else {
                    await cateProdsRepository.createCateProd({
                        category_id,
                        product_id,
                    });

                    await cacheHelper.delCache({ req });
                }
            }
        }
    };

    const updateCateProd = async ({
        req,
        id,
        category_id,
        product_id,
    }: {
        req: ExpressRequest;
        id: string;
        category_id?: string;
        product_id?: string;
    }) => {
        const cateProd = await cateProdsRepository.findOneByFilter({
            id,
        });

        if (!cateProd) {
            throw new Exception(
                `Cate prod is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataCateProd = {
                ...cateProd,
                category_id,
                product_id,
            };
            const updatedCateProd = await cateProdsRepository.updateCateProd({
                id,
                update_data: updateDataCateProd,
            });

            await cacheHelper.delCache({ req });

            return updatedCateProd;
        }
    };

    const deleteCateProd = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const cateProd = await cateProdsRepository.findOneByFilter({
            id,
        });
        if (!cateProd) {
            throw new Exception(
                `Cate prod is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await cateProdsRepository.destroyParanoidByFilter({
                id,
            });

            await cacheHelper.delCache({ req });
        }
    };

    return {
        getCateProdInfo,
        createNewCateProd,
        updateCateProd,
        deleteCateProd,
    };
};
