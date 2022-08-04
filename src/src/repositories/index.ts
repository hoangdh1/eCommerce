import { ICradle } from '../container';

import { adminsRepository } from './admin.repository';
import { customersRepository } from './customer.repository';
import { shippersRepository } from './shipper.repository';
import { cartsRepository } from './cart.repository';
import { cartItemsRepository } from './cart_item.repository';
import { ordersRepository } from './order.repository';
import { orderItemsRepository } from './order_item.repository';
import { productsRepository } from './product.repository';
import { categoriesRepository } from './category.repository';
import { cateProdsRepository } from './category_product.repository';

export const repositories = (iCradle: ICradle) => {
    return {
        adminsRepository: adminsRepository(iCradle),
        customersRepository: customersRepository(iCradle),
        shippersRepository: shippersRepository(iCradle),
        cartsRepository: cartsRepository(iCradle),
        cartItemsRepository: cartItemsRepository(iCradle),
        ordersRepository: ordersRepository(iCradle),
        orderItemsRepository: orderItemsRepository(iCradle),
        productsRepository: productsRepository(iCradle),
        categoriesRepository: categoriesRepository(iCradle),
        cateProdsRepository: cateProdsRepository(iCradle),
    };
};
