import { ICradle } from 'src/container';
import { Request as ExpressRequest } from 'express';
import { Exception, ExceptionCode } from '../exceptions';

export const categoriesUseCase = (iCradle: ICradle) => {
    const { categoriesRepository } = iCradle.repositories;
    const { cacheHelper } = iCradle.helpers;

    const getCategoryInfo = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const category_info = await categoriesRepository.findOneByFilter({
            id,
        });

        if (category_info) {
            await cacheHelper.setCache({ req, data: category_info });

            return category_info;
        } else {
            throw new Exception(
                `No information found for category`,
                ExceptionCode.VALIDATE_FAILED,
            );
        }
    };

    const createNewCategory = async ({
        req,
        name,
    }: {
        req: ExpressRequest;
        name: string;
    }) => {
        const isCategoryExist = await categoriesRepository.findOneByFilter({
            name,
        });
        if (isCategoryExist) {
            throw new Exception(
                `Category is existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await categoriesRepository.createCategory({
                name,
            });

            await cacheHelper.delCache({ req });
        }
    };

    const updateCategory = async ({
        req,
        id,
        name,
    }: {
        req: ExpressRequest;
        id: string;
        name: string;
    }) => {
        const category = await categoriesRepository.findOneByFilter({
            id,
        });

        if (!category) {
            throw new Exception(
                `Category is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            const updateDataCategory = {
                ...category,
                name,
            };
            const updatedCategory = await categoriesRepository.updateCategory({
                id,
                update_data: updateDataCategory,
            });

            await cacheHelper.delCache({ req });

            return updatedCategory;
        }
    };

    const deleteCategory = async ({
        req,
        id,
    }: {
        req: ExpressRequest;
        id: string;
    }) => {
        const category = await categoriesRepository.findOneByFilter({
            id,
        });
        if (!category) {
            throw new Exception(
                `Category is not existed in system`,
                ExceptionCode.VALIDATE_FAILED,
            );
        } else {
            await categoriesRepository.destroyParanoidByFilter({
                id,
            });

            await cacheHelper.delCache({ req });
        }
    };

    return {
        getCategoryInfo,
        createNewCategory,
        updateCategory,
        deleteCategory,
    };
};
