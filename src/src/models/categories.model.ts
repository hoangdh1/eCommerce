import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface categoryAttributes {
    id: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type categoryPk = 'id';
export type staffId = categories[categoryPk];
export type categoryCreationAttributes = Optional<
    categoryAttributes,
    categoryPk
>;

export class categories
    extends Model<categoryAttributes, categoryCreationAttributes>
    implements categoryAttributes
{
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

    static TABLE_NAME = 'categories';

    static initModel(sequelize: Sequelize.Sequelize): typeof categories {
        categories.init(
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
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: categories.TABLE_NAME,
                schema: 'public',
                hasTrigger: true,
                timestamps: true,
                paranoid: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
            },
        );

        return categories;
    }
}
