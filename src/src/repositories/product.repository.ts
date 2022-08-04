import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { productAttributes } from 'src/models/products.model';
import _ from 'lodash';

export interface IUpdateData {
    name?: string;
    image?: string;
    price?: number;
    description?: string;
    quantity?: number;
    discount?: number;
}

export const productsRepository = (iCradle: ICradle) => {
    const { products } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await products.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createProduct = async ({
        name,
        image,
        price,
        description,
        quantity,
        discount,
    }: {
        name: string;
        image: string;
        price: number;
        description: string;
        quantity: number;
        discount: number;
    }) => {
        return await products.create({
            name,
            image,
            price,
            description,
            quantity,
            discount,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<productAttributes>;
    }) => {
        return await products.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<productAttributes>;
    }) => {
        return await products.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (filter: WhereOptions<productAttributes>) => {
        return await products.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getProducts = async ({
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
        return await products.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const getListProduct = async ({
        limit,
        offset,
    }: {
        limit: number;
        offset: number;
    }) => {
        return await products.findAll({
            offset,
            limit,
            raw: true,
        });
    };

    const searchProduct = async ({ keyword }: { keyword: string }) => {
        return await products.findAll({
            where: {
                name: { [Op.iLike]: `%${keyword}%` },
            },
            raw: true,
        });
    };

    const getInventory = async () => {
        return await products.findAll({
            where: {
                quantity: { [Op.gte]: 1 },
            },
            raw: true,
        });
    };

    const updateProduct = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedProduct = await products.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedProduct[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<productAttributes>,
        force?: boolean,
    ) => {
        return await products.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createProduct,
        findByFilter,
        findOneByFilter,
        getProducts,
        getListProduct,
        searchProduct,
        getInventory,
        updateProduct,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
