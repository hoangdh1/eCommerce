import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { shipperAttributes } from 'src/models/shippers.model';
import _ from 'lodash';

export interface IUpdateData {
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    status?: string;
    last_login?: Date;
}

export const shippersRepository = (iCradle: ICradle) => {
    const { shippers } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await shippers.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createShipper = async ({
        username,
        password,
        email,
        phone,
    }: {
        username: string;
        password: string;
        email: string;
        phone: string;
    }) => {
        return await shippers.create({
            username,
            password,
            email,
            phone,
            status: 'active',
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<shipperAttributes>;
    }) => {
        return await shippers.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<shipperAttributes>;
    }) => {
        return await shippers.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (filter: WhereOptions<shipperAttributes>) => {
        return await shippers.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const findShipper = async (filter: WhereOptions<shipperAttributes>) => {
        return await shippers.findOne({
            where: {
                ...filter,
            },
            raw: true,
            attributes: { exclude: ['password'] },
        });
    };

    const getShippers = async ({
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
                        username: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        phone: { [Op.iLike]: `%${keyword}%` },
                    },
                    {
                        phone: { [Op.iLike]: `%${keyword.replace(/^0/, '')}%` },
                    },
                ],
            };
        }
        return await shippers.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateShipper = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedShipper = await shippers.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedShipper[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<shipperAttributes>,
        force?: boolean,
    ) => {
        return await shippers.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createShipper,
        findByFilter,
        findOneByFilter,
        findShipper,
        getShippers,
        updateShipper,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
