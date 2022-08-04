import { Router } from 'express';
import { ICradle } from '../../container';

export const healthFacilityTypesRouter = ({ controllers }: ICradle) => {
    const router = Router();

    /**
     * @openapi
     * /v1/cms/categories-products/info:
     *  get:
     *      tags:
     *          - "categories-products"
     *      summary: Get info category product
     *      parameters:
     *        - name: cate_prod_id
     *          in: "query"
     *          description: Get info category product
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
     *                          $ref: "#/definitions/CateProd"
     */

    /**
     * @openapi
     * definitions:
     *      CateProd:
     *          properties:
     *              id:
     *                  type: string
     *              category_id:
     *                  type: string
     *              product_id:
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
        controllers.v1.cmsControllers.cateProdsController.getCateProdInfo,
    );

    /**
     * @openapi
     * /v1/cms/categories-products/create:
     *  post:
     *      tags:
     *          - "categories-products"
     *      summary: Create new category product
     *      parameters:
     *        - name: cate_prod_info
     *          in: "body"
     *          description: Create new category product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  category_id:
     *                      type: string
     *                      required: true
     *                  product_id:
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
        controllers.v1.cmsControllers.cateProdsController.createNewCateProd,
    );

    /**
     * @openapi
     * /v1/cms/categories-products/update:
     *  put:
     *      tags:
     *          - "categories-products"
     *      summary: Update category product
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update category product
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  category_id:
     *                      type: string
     *                  product_id:
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
     *                          $ref: "#/definitions/CateProd"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.cateProdsController.updateCateProd,
    );

    /**
     * @openapi
     * /v1/cms/categories-products/delete:
     *  delete:
     *      tags:
     *          - "categories-products"
     *      summary: Delete category product
     *      parameters:
     *        - name: cate_prod_id
     *          in: "query"
     *          description: Delete category product
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
        controllers.v1.cmsControllers.cateProdsController.deleteCateProd,
    );

    return router;
};

export default healthFacilityTypesRouter;
