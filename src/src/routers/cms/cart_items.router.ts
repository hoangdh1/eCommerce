import { Router } from 'express';
import { ICradle } from 'src/container';

export const healthFacilityTypesRouter = ({ controllers }: ICradle) => {
    const router = Router();

    /**
     * @openapi
     * /v1/cms/cart-items/info:
     *  get:
     *      tags:
     *          - "cart-item"
     *      summary: Get info cart item
     *      parameters:
     *        - name: cart_item_id
     *          in: "query"
     *          description: Get info cart item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *
     *      responses:
     *          200:
     *              description: success
     *              schema:
     *                  type: object
     *                  properties:
     *                      signal:
     *                          type: number
     *                      message:
     *                          type: string
     *                      data:
     *                          type: object
     *                          $ref: "#/definitions/CartItem"
     */

    /**
     * @openapi
     * definitions:
     *      CartItem:
     *          properties:
     *              id:
     *                  type: string
     *              cart_id:
     *                  type: string
     *              product_id:
     *                  type: string
     *              count:
     *                  type: number
     *              created_at:
     *                  type: string
     *                  format: date
     *              updated_at:
     *                  type: string
     *                  format: date
     *              deleted_at:
     *                  type: string
     *                  format: date
     *
     */
    router.get(
        '/info',
        controllers.v1.cmsControllers.cartItemsController.getCartItemInfo,
    );

    /**
     * @openapi
     * /v1/cms/cart-items/create:
     *  post:
     *      tags:
     *          - "cart-item"
     *      summary: Create new cart item
     *      parameters:
     *        - name: cart_item_info
     *          in: "body"
     *          description: Create new cart item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  cart_id:
     *                      type: string
     *                      required: true
     *                  product_id:
     *                      type: string
     *                      required: true
     *                  count:
     *                      type: number
     *                      required: true
     *
     *      responses:
     *          200:
     *              description: success
     *              schema:
     *                  type: object
     *                  properties:
     *                      signal:
     *                          type: number
     *                      message:
     *                          type: string
     */
    router.post(
        '/create',
        controllers.v1.cmsControllers.cartItemsController.createNewCartItem,
    );

    /**
     * @openapi
     * /v1/cms/cart-items/update:
     *  put:
     *      tags:
     *          - "cart-item"
     *      summary: Update info cart item
     *      parameters:
     *        - name: data_update
     *          in: "body"
     *          description: Update count of cart item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  count:
     *                      type: number
     *                      required: true
     *
     *      responses:
     *          200:
     *              description: success
     *              schema:
     *                  type: object
     *                  properties:
     *                      signal:
     *                          type: number
     *                      message:
     *                          type: string
     *                      data:
     *                          type: object
     *                          $ref: "#/definitions/CartItem"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.cartItemsController.updateCartItem,
    );

    /**
     * @openapi
     * /v1/cms/cart-items/delete:
     *  delete:
     *      tags:
     *          - "cart-item"
     *      summary: Delete cart item
     *      parameters:
     *        - name: cart_item_id
     *          in: "query"
     *          description: Delete cart item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *
     *      responses:
     *          200:
     *              description: success
     *              schema:
     *                  type: object
     *                  properties:
     *                      signal:
     *                          type: number
     *                      message:
     *                          type: string
     */
    router.delete(
        '/delete',
        controllers.v1.cmsControllers.cartItemsController.deleteCartItem,
    );

    return router;
};

export default healthFacilityTypesRouter;
