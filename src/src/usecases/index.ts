import { ICradle } from '../container';

import { adminsUseCase } from './admin.usecase';
import { customersUseCase } from './customer.usecase';
import { shippersUseCase } from './shipper.usecase';
import { cartsUseCase } from './cart.usecase';
import { cartItemsUseCase } from './cart_item.usecase';
import { ordersUseCase } from './order.usecase';
import { orderItemsUseCase } from './order_item.usecase';
import { productsUseCase } from './product.usecase';
import { categoriesUseCase } from './category.usecase';
import { cateProdsUseCase } from './category_product.usecase';

export const useCases = (iCradle: ICradle) => {
    return {
        adminsUseCase: adminsUseCase(iCradle),
        customersUseCase: customersUseCase(iCradle),
        shippersUseCase: shippersUseCase(iCradle),
        cartsUseCase: cartsUseCase(iCradle),
        cartItemsUseCase: cartItemsUseCase(iCradle),
        ordersUseCase: ordersUseCase(iCradle),
        orderItemsUseCase: orderItemsUseCase(iCradle),
        productsUseCase: productsUseCase(iCradle),
        categoriesUseCase: categoriesUseCase(iCradle),
        cateProdsUseCase: cateProdsUseCase(iCradle),
    };
};
