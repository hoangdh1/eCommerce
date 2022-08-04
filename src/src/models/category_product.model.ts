import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface cateProdAttributes {
    id: string;
    category_id: string;
    product_id: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type cateProdPk = 'id';
export type staffId = category_product[cateProdPk];
export type cateProdCreationAttributes = Optional<
    cateProdAttributes,
    cateProdPk
>;

export class category_product
    extends Model<cateProdAttributes, cateProdCreationAttributes>
    implements cateProdAttributes
{
    id: string;
    category_id: string;
    product_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'category_product';

    static initModel(sequelize: Sequelize.Sequelize): typeof category_product {
        category_product.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                category_id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    references: {
                        model: 'categories',
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
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: category_product.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return category_product;
    }
}
