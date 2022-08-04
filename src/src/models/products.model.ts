import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface productAttributes {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    quantity: number;
    discount: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type productPk = 'id';
export type staffId = products[productPk];
export type productCreationAttributes = Optional<productAttributes, productPk>;

export class products
    extends Model<productAttributes, productCreationAttributes>
    implements productAttributes
{
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    quantity: number;
    discount: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'products';

    static initModel(sequelize: Sequelize.Sequelize): typeof products {
        products.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                discount: {
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
                tableName: products.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return products;
    }
}
