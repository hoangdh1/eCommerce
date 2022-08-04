import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { cateProdAttributes } from 'src/models/category_product.model';
import _ from 'lodash';

export interface IUpdateData {
    category_id?: string;
    product_id?: string;
}

export const cateProdsRepository = (iCradle: ICradle) => {
    const { category_product } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await category_product.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createCateProd = async ({
        category_id,
        product_id,
    }: {
        category_id: string;
        product_id: string;
    }) => {
        return await category_product.create({
            category_id,
            product_id,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<cateProdAttributes>;
    }) => {
        return await category_product.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<cateProdAttributes>;
    }) => {
        return await category_product.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (
        filter: WhereOptions<cateProdAttributes>,
    ) => {
        return await category_product.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getCateProd = async ({
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
                        category_id: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        product_id: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await category_product.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateCateProd = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedCateProd = await category_product.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedCateProd[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<cateProdAttributes>,
        force?: boolean,
    ) => {
        return await category_product.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createCateProd,
        findByFilter,
        findOneByFilter,
        getCateProd,
        updateCateProd,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
