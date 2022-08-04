import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { cartAttributes } from 'src/models/carts.model';
import _ from 'lodash';

export interface IUpdateData {
    customer_id?: string;
    total?: number;
}

export const cartsRepository = (iCradle: ICradle) => {
    const { carts } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await carts.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createCart = async ({ customer_id }: { customer_id: string }) => {
        return await carts.create({
            customer_id,
            total: 0,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<cartAttributes>;
    }) => {
        return await carts.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<cartAttributes>;
    }) => {
        return await carts.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (filter: WhereOptions<cartAttributes>) => {
        return await carts.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getCarts = async ({
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
                        customer_id: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await carts.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateCart = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedCart = await carts.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedCart[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<cartAttributes>,
        force?: boolean,
    ) => {
        return await carts.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createCart,
        findByFilter,
        findOneByFilter,
        getCarts,
        updateCart,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
