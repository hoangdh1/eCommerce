import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { categoryAttributes } from 'src/models/categories.model';
import _ from 'lodash';

export interface IUpdateData {
    name?: string;
}

export const categoriesRepository = (iCradle: ICradle) => {
    const { categories } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await categories.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createCategory = async ({ name }: { name: string }) => {
        return await categories.create({
            name,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<categoryAttributes>;
    }) => {
        return await categories.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<categoryAttributes>;
    }) => {
        return await categories.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (
        filter: WhereOptions<categoryAttributes>,
    ) => {
        return await categories.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getCategories = async ({
        keyword,
        limit,
        offset,
    }: {
        keyword: string;
        limit: number;
        offset: number;
    }) => {
        let queryObj: any = {};
        if (keyword) {
            queryObj = {
                [Op.or]: [
                    {
                        name: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await categories.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateCategory = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedCategory = await categories.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedCategory[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<categoryAttributes>,
        force?: boolean,
    ) => {
        return await categories.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createCategory,
        findByFilter,
        findOneByFilter,
        getCategories,
        updateCategory,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
