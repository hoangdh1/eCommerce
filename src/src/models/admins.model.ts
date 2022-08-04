import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface adminAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    last_login?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type adminPk = 'id';
export type staffId = admins[adminPk];
export type adminCreationAttributes = Optional<adminAttributes, adminPk>;

export class admins
    extends Model<adminAttributes, adminCreationAttributes>
    implements adminAttributes
{
    id!: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    last_login: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'admins';

    static initModel(sequelize: Sequelize.Sequelize): typeof admins {
        admins.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                last_login: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: admins.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return admins;
    }
}
