import { ICradle } from '../../container';
import express from 'express';

// import usersRouter from './users.router';
import adminsRouter from './admins.router';
import customersRouter from './customers.router';
import shippersRouter from './shippers.router';
import cartsRouter from './carts.router';
import cartItemsRouter from './cart_items.router';
import ordersRouter from './orders.router';
import orderItemsRouter from './order_items.router';
import productsRouter from './products.router';
import categoryRouter from './categories.router';
import cateProdsRouter from './category_products.router';
export default (iCradle: ICradle) => {
    const routers = express.Router();

    // routers.use('/users', usersRouter(iCradle));
    routers.use('/admins', adminsRouter(iCradle));
    routers.use('/customers', customersRouter(iCradle));
    routers.use('/shippers', shippersRouter(iCradle));
    routers.use('/carts', cartsRouter(iCradle));
    routers.use('/cart-items', cartItemsRouter(iCradle));
    routers.use('/orders', ordersRouter(iCradle));
    routers.use('/order-items', orderItemsRouter(iCradle));
    routers.use('/products', productsRouter(iCradle));
    routers.use('/categories', categoryRouter(iCradle));
    routers.use('/categories-products', cateProdsRouter(iCradle));
    return routers;
};
