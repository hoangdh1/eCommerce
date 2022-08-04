import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface orderItemAttributes {
    id: string;
    order_id: string;
    product_id: string;
    count: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type orderItemPk = 'id';
export type staffId = order_items[orderItemPk];
export type orderItemCreationAttributes = Optional<
    orderItemAttributes,
    orderItemPk
>;

export class order_items
    extends Model<orderItemAttributes, orderItemCreationAttributes>
    implements orderItemAttributes
{
    id: string;
    order_id: string;
    product_id: string;
    count: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'order_items';

    static initModel(sequelize: Sequelize.Sequelize): typeof order_items {
        order_items.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                order_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'orders',
                        key: 'id',
                    },
                },
                product_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'products',
                        key: 'id',
                    },
                },
                count: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: order_items.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return order_items;
    }
}
