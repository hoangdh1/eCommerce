import { Router } from 'express';
import { ICradle } from 'src/container';

export const healthFacilityTypesRouter = ({ controllers }: ICradle) => {
    const router = Router();

    /**
     * @openapi
     * /v1/cms/carts/info:
     *  get:
     *      tags:
     *          - "carts"
     *      summary: Get info cart
     *      parameters:
     *        - name: cart_id
     *          in: "query"
     *          description: Get info cart
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
     *                          $ref: "#/definitions/Cart"
     */

    /**
     * @openapi
     * definitions:
     *      Cart:
     *          properties:
     *              id:
     *                  type: string
     *              customer_id:
     *                  type: string
     *              total:
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
        controllers.v1.cmsControllers.cartsController.getBasicInfo,
    );

    /**
     * @openapi
     * /v1/cms/carts/create:
     *  post:
     *      tags:
     *          - "carts"
     *      summary: Create new cart
     *      parameters:
     *        - name: cart_info
     *          in: "body"
     *          description: Create new cart
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  customer_id:
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
        controllers.v1.cmsControllers.cartsController.createNewCart,
    );

    /**
     * @openapi
     * /v1/cms/carts/update:
     *  put:
     *      tags:
     *          - "carts"
     *      summary: Update info cart
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update info cart
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  total:
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
     *                          $ref: "#/definitions/Cart"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.cartsController.updateCart,
    );

    /**
     * @openapi
     * /v1/cms/carts/delete:
     *  delete:
     *      tags:
     *          - "carts"
     *      summary: Delete cart
     *      parameters:
     *        - name: cart_id
     *          in: "query"
     *          description: Delete cart
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
        controllers.v1.cmsControllers.cartsController.deleteCart,
    );

    return router;
};

export default healthFacilityTypesRouter;
