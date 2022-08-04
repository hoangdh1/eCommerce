/* eslint-disable no-unused-vars */
import { ICradle } from 'src/container';

import { Sequelize } from 'sequelize';
import { defaults } from 'pg';

import { admins } from './admins.model';
import { customers } from './customers.model';
import { shippers } from './shippers.model';
import { products } from './products.model';
import { categories } from './categories.model';
import { category_product } from './category_product.model';
import { carts } from './carts.model';
import { cart_items } from './cart_items.model';
import { orders } from './orders.model';
import { order_items } from './order_items.model';

export const models = (sequelize: Sequelize, iCradle: ICradle) => {
    admins.initModel(sequelize);
    customers.initModel(sequelize);
    shippers.initModel(sequelize);
    products.initModel(sequelize);
    categories.initModel(sequelize);
    category_product.initModel(sequelize);
    carts.initModel(sequelize);
    cart_items.initModel(sequelize);
    orders.initModel(sequelize);
    order_items.initModel(sequelize);

    // cart reference
    customers.hasOne(carts);
    carts.belongsTo(customers, { foreignKey: 'customer_id' });

    // cart item reference
    carts.hasMany(cart_items);
    cart_items.belongsTo(carts, { foreignKey: 'cart_id' });

    products.hasMany(cart_items);
    cart_items.belongsTo(products, { foreignKey: 'product_id' });

    // order reference
    customers.hasMany(orders);
    orders.belongsTo(customers, { foreignKey: 'customer_id' });

    shippers.hasMany(orders);
    orders.belongsTo(shippers, { foreignKey: 'shipper_id' });

    // order item reference
    orders.hasMany(order_items);
    order_items.belongsTo(orders, {
        foreignKey: 'order_id',
    });

    products.hasMany(order_items);
    order_items.belongsTo(products, { foreignKey: 'product_id' });

    // category product reference
    categories.hasMany(category_product);
    category_product.belongsTo(categories, { foreignKey: 'category_id' });

    products.hasMany(category_product);
    category_product.belongsTo(products, { foreignKey: 'product_id' });

    return {
        admins,
        customers,
        shippers,
        products,
        categories,
        category_product,
        carts,
        cart_items,
        orders,
        order_items,
    };
};
