import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { customerAttributes } from 'src/models/customers.model';
import _ from 'lodash';

export interface IUpdateData {
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    last_login?: Date;
}

export const customersRepository = (iCradle: ICradle) => {
    const { customers } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await customers.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createCustomer = async ({
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
        return await customers.create({
            username,
            password,
            email,
            phone,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<customerAttributes>;
    }) => {
        return await customers.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<customerAttributes>;
    }) => {
        return await customers.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (
        filter: WhereOptions<customerAttributes>,
    ) => {
        return await customers.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const findCustomer = async (filter: WhereOptions<customerAttributes>) => {
        return await customers.findOne({
            where: {
                ...filter,
            },
            raw: true,
            attributes: { exclude: ['password'] },
        });
    };

    const getCustomers = async ({
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
        return await customers.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateCustomer = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedCustomer = await customers.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedCustomer[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<customerAttributes>,
        force?: boolean,
    ) => {
        return await customers.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createCustomer,
        findByFilter,
        findOneByFilter,
        findCustomer,
        getCustomers,
        updateCustomer,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
