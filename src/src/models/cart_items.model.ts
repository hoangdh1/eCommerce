import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface cartItemAttributes {
    id: string;
    cart_id: string;
    product_id: string;
    count: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type cartItemPk = 'id';
export type staffId = cart_items[cartItemPk];
export type cartItemCreationAttributes = Optional<
    cartItemAttributes,
    cartItemPk
>;

export class cart_items
    extends Model<cartItemAttributes, cartItemCreationAttributes>
    implements cartItemAttributes
{
    id: string;
    cart_id: string;
    product_id: string;
    count: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'cart_items';

    static initModel(sequelize: Sequelize.Sequelize): typeof cart_items {
        cart_items.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                cart_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'carts',
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
                tableName: cart_items.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return cart_items;
    }
}
