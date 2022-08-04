import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { cartItemAttributes } from 'src/models/cart_items.model';
import _ from 'lodash';

export interface IUpdateData {
    cart_id?: string;
    product_id?: string;
    count?: number;
}

export const cartItemsRepository = (iCradle: ICradle) => {
    const { cart_items } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await cart_items.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createCartItem = async ({
        cart_id,
        product_id,
        count,
    }: {
        cart_id: string;
        product_id: string;
        count: number;
    }) => {
        return await cart_items.create({
            cart_id,
            product_id,
            count,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<cartItemAttributes>;
    }) => {
        return await cart_items.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<cartItemAttributes>;
    }) => {
        return await cart_items.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (
        filter: WhereOptions<cartItemAttributes>,
    ) => {
        return await cart_items.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getCartItems = async ({
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
                        cart_id: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        product_id: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await cart_items.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateCartItem = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedCartItem = await cart_items.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedCartItem[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<cartItemAttributes>,
        force?: boolean,
    ) => {
        return await cart_items.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createCartItem,
        findByFilter,
        findOneByFilter,
        getCartItems,
        updateCartItem,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
