import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface customerAttributes {
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

export type customerPk = 'id';
export type staffId = customers[customerPk];
export type customerCreationAttributes = Optional<
    customerAttributes,
    customerPk
>;

export class customers
    extends Model<customerAttributes, customerCreationAttributes>
    implements customerAttributes
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

    static TABLE_NAME = 'customers';

    static initModel(sequelize: Sequelize.Sequelize): typeof customers {
        customers.init(
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
                tableName: customers.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return customers;
    }
}
