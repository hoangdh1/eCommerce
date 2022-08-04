import { Router } from 'express';
import { ICradle } from '../../container';

export const healthFacilityTypesRouter = ({
    controllers,
    middlewares,
}: ICradle) => {
    const { authMiddleware, limitBuyMiddleware } = middlewares;

    const router = Router();

    /**
     * @openapi
     * /v1/cms/order-items/info:
     *  get:
     *      tags:
     *          - "order-item"
     *      summary: Get info order item
     *      parameters:
     *        - name: order_item_id
     *          in: "query"
     *          description: Get info order item
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
     *                          $ref: "#/definitions/OrderItem"
     */

    /**
     * @openapi
     * definitions:
     *      OrderItem:
     *          properties:
     *              id:
     *                  type: string
     *              order_id:
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
        controllers.v1.cmsControllers.orderItemsController.getOrderItemInfo,
    );

    /**
     * @openapi
     * /v1/cms/order-items/create:
     *  post:
     *      tags:
     *          - "order-item"
     *      summary: Create new order item
     *      parameters:
     *        - name: order_item_info
     *          in: "body"
     *          description: Create new order item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  order_id:
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
        limitBuyMiddleware.checkLimitBuy,
        controllers.v1.cmsControllers.orderItemsController.createNewOrderItem,
    );

    /**
     * @openapi
     * /v1/cms/order-items/update:
     *  put:
     *      tags:
     *          - "order-item"
     *      summary: Update info order item
     *      parameters:
     *        - name: data_update
     *          in: "body"
     *          description: Update order item
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  order_id:
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
     *                      data:
     *                          type: object
     *                          $ref: "#/definitions/CartItem"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.orderItemsController.updateOrderItem,
    );

    /**
     * @openapi
     * /v1/cms/order-items/delete:
     *  delete:
     *      tags:
     *          - "order-item"
     *      summary: Delete order item
     *      parameters:
     *        - name: order_item_id
     *          in: "query"
     *          description: Delete order item
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
        controllers.v1.cmsControllers.orderItemsController.deleteOrderItem,
    );

    // Best selling products by day

    /**
     * @openapi
     * /v1/cms/order-items/best-selling:
     *  get:
     *      tags:
     *          - "order-item"
     *      summary: Get list product best selling in day
     *      parameters:
     *        - name: day
     *          in: "body"
     *          description: Get list product best selling in day
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  day:
     *                      type: string
     *                      format: date
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
     *                          type: array
     *                          item:
     *                              $ref: "#/definitions/BestSelling"
     */

    /**
     * @openapi
     * definitions:
     *      BestSelling:
     *          properties:
     *              name:
     *                  type: string
     *              product_id:
     *                  type: string
     *              count:
     *                  type: number
     *
     */
    router.get(
        '/best-selling',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.orderItemsController.getBestSelling,
    );

    return router;
};

export default healthFacilityTypesRouter;
