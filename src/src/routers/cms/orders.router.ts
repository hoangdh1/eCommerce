import { Router } from 'express';
import { ICradle } from '../../container';

export const healthFacilityTypesRouter = ({
    controllers,
    middlewares,
}: ICradle) => {
    const router = Router();

    const { authMiddleware } = middlewares;

    /**
     * @openapi
     * /v1/cms/orders/info:
     *  get:
     *      tags:
     *          - "orders"
     *      summary: Get info order
     *      parameters:
     *        - name: order_id
     *          in: "query"
     *          description: Get info order
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
     *                          $ref: "#/definitions/Order"
     */

    /**
     * @openapi
     * definitions:
     *      Order:
     *          properties:
     *              id:
     *                  type: string
     *              customer_id:
     *                  type: string
     *              shipper_id:
     *                  type: string
     *              total:
     *                  type: number
     *              status:
     *                  type: string
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
        controllers.v1.cmsControllers.ordersController.getOrderInfo,
    );

    /**
     * @openapi
     * /v1/cms/orders/create:
     *  post:
     *      tags:
     *          - "orders"
     *      summary: Create new order
     *      parameters:
     *        - name: order_info
     *          in: "body"
     *          description: Create new order
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  customer_id:
     *                      type: string
     *                      required: true
     *                  shipper_id:
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
    router.post(
        '/create',
        controllers.v1.cmsControllers.ordersController.createNewOrder,
    );

    /**
     * @openapi
     * /v1/cms/orders/update:
     *  put:
     *      tags:
     *          - "orders"
     *      summary: Update info order
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update info order
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  customer_id:
     *                      type: string
     *                  shipper_id:
     *                      type: string
     *                  total:
     *                      type: number
     *                  status:
     *                      type: string
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
     *                          $ref: "#/definitions/Order"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.ordersController.updateOrder,
    );

    /**
     * @openapi
     * /v1/cms/orders/delete:
     *  delete:
     *      tags:
     *          - "orders"
     *      summary: Delete order
     *      parameters:
     *        - name: order_id
     *          in: "query"
     *          description: Delete order
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
        controllers.v1.cmsControllers.ordersController.deleteOrder,
    );

    // Permission for admin

    /**
     * @openapi
     * /v1/cms/orders/export-order:
     *  put:
     *      tags:
     *          - "orders"
     *      summary: Export order
     *      parameters:
     *        - name: order_id_status
     *          in: "body"
     *          description: Admin change status of order to exported
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  status:
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
     *                          $ref: "#/definitions/Order"
     */
    router.put(
        '/export-order',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.ordersController.exportOrder,
    );

    /**
     * @openapi
     * /v1/cms/orders/assign-shipper-order:
     *  put:
     *      tags:
     *          - "orders"
     *      summary: Assign shipper to order
     *      parameters:
     *        - name: order_id_shipper_id
     *          in: "body"
     *          description: Admin assign shipper to order
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  shipper_id:
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
     *                          $ref: "#/definitions/Order"
     */
    router.put(
        '/assign-shipper-order',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.ordersController.assignShipper,
    );

    // Permission for shipper

    /**
     * @openapi
     * /v1/cms/orders/get-order-list:
     *  get:
     *      tags:
     *          - "orders"
     *      summary: Shipper get order list
     *      parameters:
     *        - name: order_shipper_id
     *          in: "body"
     *          description: Shipper get order list is assigned
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  shipper_id:
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
     *                          type: array
     *                          item:
     *                              $ref: "#/definitions/Order"
     */
    router.get(
        '/get-order-list',
        authMiddleware.authShipper,
        controllers.v1.cmsControllers.ordersController.getOrderList,
    );

    /**
     * @openapi
     * /v1/cms/orders/update-status-order:
     *  put:
     *      tags:
     *          - "orders"
     *      summary: Shipper update status of order
     *      parameters:
     *        - name: order_shipper_id_status
     *          in: "body"
     *          description: Shipper update status of order
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  shipper_id:
     *                      type: string
     *                      required: true
     *                  status:
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
     *                          $ref: "#/definitions/Order"
     */
    router.put(
        '/update-status-order',
        authMiddleware.authShipper,
        controllers.v1.cmsControllers.ordersController.updateStatusOrder,
    );

    return router;
};

export default healthFacilityTypesRouter;
