import { ICradle } from '../../../container';

import { adminsController } from './admin.controller';
import { customersController } from './customer.controller';
import { shippersController } from './shipper.controller';
import { cartsController } from './cart.controller';
import { cartItemsController } from './cart_item.controller';
import { ordersController } from './order.controller';
import { orderItemsController } from './order_item.controller';
import { productsController } from './product.controller';
import { categoriesController } from './category.controller';
import { cateProdsController } from './category_product.controller';

export const cmsControllers = (iCradle: ICradle) => {
    return {
        adminsController: adminsController(iCradle),
        customersController: customersController(iCradle),
        shippersController: shippersController(iCradle),
        cartsController: cartsController(iCradle),
        cartItemsController: cartItemsController(iCradle),
        ordersController: ordersController(iCradle),
        orderItemsController: orderItemsController(iCradle),
        productsController: productsController(iCradle),
        categoriesController: categoriesController(iCradle),
        cateProdsController: cateProdsController(iCradle),
    };
};
