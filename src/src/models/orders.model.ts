import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface orderAttributes {
    id: string;
    customer_id: string;
    shipper_id: string;
    total: number;
    status: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type orderPk = 'id';
export type staffId = orders[orderPk];
export type orderCreationAttributes = Optional<orderAttributes, orderPk>;

export class orders
    extends Model<orderAttributes, orderCreationAttributes>
    implements orderAttributes
{
    id: string;
    customer_id: string;
    shipper_id: string;
    total: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'orders';

    static initModel(sequelize: Sequelize.Sequelize): typeof orders {
        orders.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                customer_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'customers',
                        key: 'id',
                    },
                },
                shipper_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'shippers',
                        key: 'id',
                    },
                },
                total: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.ENUM(
                        'inStock',
                        'exported',
                        'shipped',
                        'completed',
                        'canceled',
                        'recalled',
                    ),
                    allowNull: false,
                    defaultValue: 'inStock',
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: orders.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return orders;
    }
}
