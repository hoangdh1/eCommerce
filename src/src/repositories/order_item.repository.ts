import { ICradle } from '../container';
import { Op, WhereOptions } from 'sequelize';
import { orderItemAttributes } from '../models/order_items.model';
import _ from 'lodash';

export interface IUpdateData {
    order_id?: string;
    product_id?: string;
    count?: number;
}

export const orderItemsRepository = (iCradle: ICradle) => {
    const { sequelize } = iCradle.sequelizeModel;
    const { order_items } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await order_items.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createOrderItem = async ({
        order_id,
        product_id,
        count,
    }: {
        order_id: string;
        product_id: string;
        count: number;
    }) => {
        return await order_items.create({
            order_id,
            product_id,
            count,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<orderItemAttributes>;
    }) => {
        return await order_items.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<orderItemAttributes>;
    }) => {
        return await order_items.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (
        filter: WhereOptions<orderItemAttributes>,
    ) => {
        return await order_items.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const getOrderItems = async ({
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
                        order_id: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        product_id: { [Op.iLike]: `%${keyword}%` },
                    },
                ],
            };
        }
        return await order_items.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    //     select P.name, OT.product_id, count(OT.product_id)
    // from order_items as OT LEFT OUTER JOIN products as P on OT.product_id = P.id
    // where OT.created_at between TIMESTAMP WITHOUT TIME ZONE '2022-06-25 10:57:59.123' AND TIMESTAMP WITHOUT TIME ZONE '2022-06-25 10:57:59.123' +  interval '24 hours'
    // group by OT.product_id, p.id
    // -- having count(OT.product_id) >= 1
    // ORDER BY COUNT(OT.product_id) desc
    // limit 3

    const getBestSelling = async ({ day_format }: { day_format: String }) => {
        const resulst = await sequelize.query(
            `select P.name, OT.product_id, count(OT.product_id) 
            from order_items as OT LEFT OUTER JOIN products as P on OT.product_id = P.id
            where OT.created_at between TIMESTAMP WITHOUT TIME ZONE '${day_format}' AND TIMESTAMP WITHOUT TIME ZONE '${day_format}' +  interval '24 hours'
            group by OT.product_id, p.id
            order by COUNT(OT.product_id) desc
            limit 3`,
            { raw: true },
        );

        console.log('results: ', resulst);

        return resulst[0];
    };

    // select c.username, sum(ot.count)
    // from customers as c
    // join orders as o
    //     on c.id = o.customer_id
    // join order_items as ot
    //     on o.id = ot.order_id
    // group by c.id, o.id
    // having o.id = '7d038a13-acce-4028-a034-6719731dcf08'
    const checkLimitBuy = async ({ order_id }: { order_id: String }) => {
        const resulst = await sequelize.query(
            `select sum(ot.count)
                from customers as c 
                join orders as o
                    on c.id = o.customer_id
                join order_items as ot
                    on o.id = ot.order_id
                group by c.id, o.id
                having o.id = '${order_id}'`,
            {
                plain: true,
                raw: true,
            },
        );

        // console.log('results: ', resulst);
        return resulst?.sum;
    };

    const updateOrderItem = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedOrderItem = await order_items.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedOrderItem[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<orderItemAttributes>,
        force?: boolean,
    ) => {
        return await order_items.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createOrderItem,
        findByFilter,
        findOneByFilter,
        getOrderItems,
        getBestSelling,
        checkLimitBuy,
        updateOrderItem,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
