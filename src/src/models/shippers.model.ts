import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface shipperAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    last_login?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type shipperPk = 'id';
export type staffId = shippers[shipperPk];
export type shipperCreationAttributes = Optional<shipperAttributes, shipperPk>;

export class shippers
    extends Model<shipperAttributes, shipperCreationAttributes>
    implements shipperAttributes
{
    id!: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    last_login: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'shippers';

    static initModel(sequelize: Sequelize.Sequelize): typeof shippers {
        shippers.init(
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
                status: {
                    type: DataTypes.ENUM('active', 'disabled'),
                    allowNull: false,
                    defaultValue: 'active',
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
                tableName: shippers.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return shippers;
    }
}
