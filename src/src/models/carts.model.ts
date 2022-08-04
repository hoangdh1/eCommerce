import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface cartAttributes {
    id: string;
    customer_id: string;
    total: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type cartPk = 'id';
export type staffId = carts[cartPk];
export type cartCreationAttributes = Optional<cartAttributes, cartPk>;

export class carts
    extends Model<cartAttributes, cartCreationAttributes>
    implements cartAttributes
{
    id: string;
    customer_id: string;
    total: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'carts';

    static initModel(sequelize: Sequelize.Sequelize): typeof carts {
        carts.init(
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
                total: {
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
                tableName: carts.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return carts;
    }
}
