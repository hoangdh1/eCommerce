import { ICradle } from 'src/container';
import { Op, WhereOptions } from 'sequelize';
import { adminAttributes } from 'src/models/admins.model';
import _ from 'lodash';

export interface IUpdateData {
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    last_login?: Date;
}

export const adminsRepository = (iCradle: ICradle) => {
    const { admins } = iCradle.sequelizeModel.models;

    const findById = async ({ id }: { id: string }) => {
        return await admins.findOne({
            where: {
                id,
            },
            raw: true,
        });
    };

    const createAdmin = async ({
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
        return await admins.create({
            username,
            password,
            email,
            phone,
        });
    };

    const findByFilter = async ({
        query,
    }: {
        query: WhereOptions<adminAttributes>;
    }) => {
        return await admins.findOne({
            where: query,
            raw: true,
        });
    };

    const findAllByFilter = async ({
        query,
    }: {
        query: WhereOptions<adminAttributes>;
    }) => {
        return await admins.findAll({
            where: query,
            raw: true,
        });
    };

    const findOneByFilter = async (filter: WhereOptions<adminAttributes>) => {
        return await admins.findOne({
            where: {
                ...filter,
            },
            raw: true,
        });
    };

    const findAdmin = async (filter: WhereOptions<adminAttributes>) => {
        return await admins.findOne({
            where: {
                ...filter,
            },
            raw: true,
            attributes: { exclude: ['password'] },
        });
    };

    const getAdmins = async ({
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
        return await admins.findAll({
            where: queryObj,
            offset,
            limit,
            raw: true,
        });
    };

    const updateAdmin = async ({
        id,
        update_data,
    }: {
        id: string;
        update_data: IUpdateData;
    }) => {
        const updatedAdmin = await admins.update(update_data, {
            where: { id },
            returning: true,
        });
        return updatedAdmin[1];
    };

    const destroyParanoidByFilter = async (
        filter: WhereOptions<adminAttributes>,
        force?: boolean,
    ) => {
        return await admins.destroy({
            where: filter,
            force: _.isBoolean(force) ? force : false,
        });
    };

    return {
        findById,
        createAdmin,
        findByFilter,
        findOneByFilter,
        findAdmin,
        getAdmins,
        updateAdmin,
        findAllByFilter,
        destroyParanoidByFilter,
    };
};
