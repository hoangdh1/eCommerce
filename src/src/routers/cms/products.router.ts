import { Router } from 'express';
import { ICradle } from 'src/container';

export const healthFacilityTypesRouter = ({
    controllers,
    middlewares,
}: ICradle) => {
    const { authMiddleware } = middlewares;

    const router = Router();

    /**
     * @openapi
     * /v1/cms/products/info:
     *  get:
     *      tags:
     *          - "products"
     *      summary: Get info product
     *      parameters:
     *        - name: product_id
     *          in: "query"
     *          description: Get info product
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
     *                          $ref: "#/definitions/Product"
     */

    /**
     * @openapi
     * definitions:
     *      Product:
     *          properties:
     *              id:
     *                  type: string
     *              name:
     *                  type: string
     *              image:
     *                  type: string
     *              price:
     *                  type: number
     *              description:
     *                  type: string
     *              quantity:
     *                  type: number
     *              discount:
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
        controllers.v1.cmsControllers.productsController.getBasicInfo,
    );

    /**
     * @openapi
     * /v1/cms/products/get-list-product:
     *  get:
     *      tags:
     *          - "products"
     *      summary: Get list product
     *      parameters:
     *        - name: limit_offset
     *          in: "body"
     *          description: Get list product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  limit:
     *                      type: number
     *                      required: true
     *                  offset:
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
     *                          type: array
     *                          item:
     *                              $ref: "#/definitions/Product"
     */
    router.get(
        '/get-list-product',
        controllers.v1.cmsControllers.productsController.getListProduct,
    );

    /**
     * @openapi
     * /v1/cms/products/search-product:
     *  get:
     *      tags:
     *          - "products"
     *      summary: Search product
     *      parameters:
     *        - name: keyword
     *          in: "body"
     *          description: Search product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  keyword:
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
     *                              $ref: "#/definitions/Product"
     */
    router.get(
        '/search-product',
        controllers.v1.cmsControllers.productsController.searchProduct,
    );

    /**
     * @openapi
     * /v1/cms/products/create:
     *  post:
     *      tags:
     *          - "products"
     *      summary: Create product
     *      parameters:
     *        - name: product_info
     *          in: "body"
     *          description: Create new product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  name:
     *                      type: string
     *                      required: true
     *                  image:
     *                      type: string
     *                      required: true
     *                  price:
     *                      type: number
     *                      required: true
     *                  description:
     *                      type: string
     *                      required: true
     *                  quantity:
     *                      type: number
     *                      required: true
     *                  discount:
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
     *                          $ref: "#/definitions/Product"
     */
    router.post(
        '/create',
        controllers.v1.cmsControllers.productsController.createNewProduct,
    );

    /**
     * @openapi
     * /v1/cms/products/update:
     *  put:
     *      tags:
     *          - "products"
     *      summary: Update product
     *      parameters:
     *        - name: product_info
     *          in: "body"
     *          description: Update info of product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  name:
     *                      type: string
     *                  image:
     *                      type: string
     *                  price:
     *                      type: number
     *                  description:
     *                      type: string
     *                  quantity:
     *                      type: number
     *                  discount:
     *                      type: number
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
     *                          $ref: "#/definitions/Product"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.productsController.updateProduct,
    );

    /**
     * @openapi
     * /v1/cms/products/delete:
     *  delete:
     *      tags:
     *          - "products"
     *      summary: Delete product
     *      parameters:
     *        - name: product_id
     *          in: "query"
     *          description: Delete product
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
        controllers.v1.cmsControllers.productsController.deleteProduct,
    );

    // Permission for admin

    /**
     * @openapi
     * /v1/cms/products/product-inventory:
     *  get:
     *      tags:
     *          - "products"
     *      summary: Statistic product in inventory
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
     *                              $ref: "#/definitions/Product"
     */
    router.get(
        '/product-inventory',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.productsController.statisticInventory,
    );

    /**
     * @openapi
     * /v1/cms/products/sale-off:
     *  put:
     *      tags:
     *          - "products"
     *      summary: Sale off product
     *      parameters:
     *        - name: sale_off
     *          in: "body"
     *          description: Sale off product in a period time
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  start:
     *                      type: string
     *                      format: date
     *                      required: true
     *                  end:
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
     */
    router.put(
        '/sale-off',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.productsController.saleOff,
    );

    return router;
};

export default healthFacilityTypesRouter;
