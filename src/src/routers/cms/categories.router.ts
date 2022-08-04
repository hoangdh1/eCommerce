import { Router } from 'express';
import { ICradle } from '../../container';

export const healthFacilityTypesRouter = ({ controllers }: ICradle) => {
    const router = Router();

    /**
     * @openapi
     * /v1/cms/categories/info:
     *  get:
     *      tags:
     *          - "categories"
     *      summary: Get info category
     *      parameters:
     *        - name: category_id
     *          in: "query"
     *          description: Get info category
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
     *                          $ref: "#/definitions/Category"
     */

    /**
     * @openapi
     * definitions:
     *      Category:
     *          properties:
     *              id:
     *                  type: string
     *              name:
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
        controllers.v1.cmsControllers.categoriesController.getCategoryInfo,
    );

    /**
     * @openapi
     * /v1/cms/categories/create:
     *  post:
     *      tags:
     *          - "categories"
     *      summary: Create new category
     *      parameters:
     *        - name: category_name
     *          in: "body"
     *          description: Create new category
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  name:
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
        controllers.v1.cmsControllers.categoriesController.createNewCategory,
    );

    /**
     * @openapi
     * /v1/cms/categories/update:
     *  put:
     *      tags:
     *          - "categories"
     *      summary: Update name category
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update name of category
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  name:
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
     *                          $ref: "#/definitions/Category"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.categoriesController.updateCategory,
    );

    /**
     * @openapi
     * /v1/cms/categories/delete:
     *  delete:
     *      tags:
     *          - "categories"
     *      summary: Delete category
     *      parameters:
     *        - name: category_id
     *          in: "query"
     *          description: Delete category
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
        controllers.v1.cmsControllers.categoriesController.deleteCategory,
    );

    return router;
};

export default healthFacilityTypesRouter;
