import { Router } from 'express';
import { ICradle } from 'src/container';

export const healthFacilityTypesRouter = ({
    controllers,
    middlewares,
}: ICradle) => {
    const router = Router();

    const { rateLimitMiddleware } = middlewares;

    /**
     * @openapi
     * /v1/cms/customers/info:
     *  get:
     *      tags:
     *          - "customers"
     *      summary: Get info customer
     *      parameters:
     *        - name: customer_id
     *          in: "query"
     *          description: Get info customer
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
     *                          $ref: "#/definitions/CustomerInfo"
     */

    /**
     * @openapi
     * definitions:
     *      CustomerInfo:
     *          properties:
     *              id:
     *                  type: string
     *              username:
     *                  type: string
     *              email:
     *                  type: string
     *              phone:
     *                  type: string
     *              last_login:
     *                  type: string
     *                  format: date
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
        controllers.v1.cmsControllers.customersController.getBasicInfo,
    );

    /**
     * @openapi
     * /v1/cms/customers/register:
     *  post:
     *      tags:
     *          - "customers"
     *      summary: Register customer
     *      parameters:
     *        - name: customer_info
     *          in: "body"
     *          description: Register customer
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  username:
     *                      type: string
     *                      required: true
     *                  password:
     *                      type: string
     *                      required: true
     *                  email:
     *                      type: string
     *                      required: true
     *                  phone:
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
        '/register',
        controllers.v1.cmsControllers.customersController.createNewCustomer,
    );

    /**
     * @openapi
     * /v1/cms/customers/login:
     *  put:
     *      tags:
     *          - "customers"
     *      summary: Customer login
     *      parameters:
     *        - name: customer_login_info
     *          in: "body"
     *          description: Customer login
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  email:
     *                      type: string
     *                      required: true
     *                  phone:
     *                      type: string
     *                      required: true
     *                  password:
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
     *                          $ref: "#/definitions/Customer"
     *                      token:
     *                          type: string
     */

    /**
     * @openapi
     * definitions:
     *      Customer:
     *          properties:
     *              id:
     *                  type: string
     *              username:
     *                  type: string
     *              password:
     *                  type: string
     *              email:
     *                  type: string
     *              phone:
     *                  type: string
     *              last_login:
     *                  type: string
     *                  format: date
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
    router.put(
        '/login',
        (req, res, next) => {
            rateLimitMiddleware.checkLogin(req, res, next, 'customer');
        },
        (req, res, next) => {
            rateLimitMiddleware.rateLimitLogin(req, res, next);
        },
        controllers.v1.cmsControllers.customersController.login,
    );

    /**
     * @openapi
     * /v1/cms/customers/update:
     *  put:
     *      tags:
     *          - "customers"
     *      summary: Update info customer
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update info customer
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  id:
     *                      type: string
     *                      required: true
     *                  username:
     *                      type: string
     *                  email:
     *                      type: string
     *                  phone:
     *                      type: string
     *                  password:
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
     *                          $ref: "#/definitions/Customer"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.customersController.updateCustomer,
    );

    /**
     * @openapi
     * /v1/cms/customers/delete:
     *  delete:
     *      tags:
     *          - "customers"
     *      summary: Delete customer
     *      parameters:
     *        - name: customer_id
     *          in: "query"
     *          description: Delete customer
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
        controllers.v1.cmsControllers.customersController.deleteCustomer,
    );

    /**
     * @openapi
     * /v1/cms/customers/password-forgot:
     *  put:
     *      tags:
     *          - "customers"
     *      summary: Customer forgot password
     *      parameters:
     *        - name: customer_id
     *          in: "body"
     *          description: Send email to customer when the customer forgot password
     *          required: true
     *          schema:
     *              type: object
     *              properties:
     *                  username:
     *                      type: string
     *                      required: true
     *                  email:
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
    router.put(
        '/password-forgot',
        controllers.v1.cmsControllers.customersController.sendEmail,
    );

    return router;
};

export default healthFacilityTypesRouter;
