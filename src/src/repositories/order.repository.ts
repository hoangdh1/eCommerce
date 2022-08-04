import { ICradle } from '../container';
import { Op, WhereOptions } from 'sequelize';
import { orderAttributes } from '../models/orders.model';
import _ from 'lodash';

export interface IUpdateData {
    customer_id?: string;
    shipper_id?: string;
    total?: number;
    status?: string;
}

export const ordersRepository = (iCradle: ICradle) => {
    const { sequelize } = iCradle.sequelizeModel;
    const { orders } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await orders.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createOrder = async ({
        customer_id,
        shipper_id,
    }: {
        customer_id: string;
        shipper_id: string;
    }) => {
        // First, we start a transaction and save it into a variable
        const t = await sequelize.transaction();
        try {
            await orders.create(
                {
                    customer_id,
                    shipper_id,
                    total: 0,
                    status: 'inStock',
                },
                { transaction: t },
            );
            await t.commit();
        } catch (error) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
        }
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<orderAttributes>;
    }) => {
        return await orders.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async (filter: WhereOptions<orderAttributes>) => {
        return await orders.findAll({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const findOneByFilter = async (filter: WhereOptions<orderAttributes>) => {
        return await orders.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getOrders = async ({
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
                    {
                        shipper_id: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        status: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await orders.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateOrder = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedOrder = await orders.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedOrder[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<orderAttributes>,
        force?: boolean,
    ) => {
        return await orders.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createOrder,
        findByFilter,
        findOneByFilter,
        getOrders,
        updateOrder,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
