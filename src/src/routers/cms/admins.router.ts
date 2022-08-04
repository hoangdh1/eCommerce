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
     * /v1/cms/admins/info:
     *  get:
     *      tags:
     *          - "admins"
     *      summary: Get info admin
     *      parameters:
     *        - name: admin_id
     *          in: "query"
     *          description: Get info admin
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
     *                          $ref: "#/definitions/AdminInfo"
     */

    /**
     * @openapi
     * definitions:
     *      AdminInfo:
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
        controllers.v1.cmsControllers.adminsController.getBasicInfo,
    );

    /**
     * @openapi
     * /v1/cms/admins/register:
     *  post:
     *      tags:
     *          - "admins"
     *      summary: Register admin
     *      parameters:
     *        - name: admin_info
     *          in: "body"
     *          description: Registry admin
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
     */
    router.post(
        '/register',
        controllers.v1.cmsControllers.adminsController.createNewAdmin,
    );

    /**
     * @openapi
     * /v1/cms/admins/login:
     *  put:
     *      tags:
     *          - "admins"
     *      summary: Admin login
     *      parameters:
     *        - name: admin_login_info
     *          in: "body"
     *          description: Admin login
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
     *                          $ref: "#/definitions/Admin"
     *                      token:
     *                          type: string
     */

    /**
     * @openapi
     * definitions:
     *      Admin:
     *          properties:
     *              id:
     *                  type: string
     *              username:
     *                  type: string
     *              email:
     *                  type: string
     *              phone:
     *                  type: string
     *              password:
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
            rateLimitMiddleware.checkLogin(req, res, next, 'admin');
        },
        (req, res, next) => {
            rateLimitMiddleware.rateLimitLogin(req, res, next);
        },
        controllers.v1.cmsControllers.adminsController.login,
    );

    /**
     * @openapi
     * /v1/cms/admins/update:
     *  put:
     *      tags:
     *          - "admins"
     *      summary: Update admin
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update info for admin
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
     *                          $ref: "#/definitions/Admin"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.adminsController.updateAdmin,
    );

    /**
     * @openapi
     * /v1/cms/admins/delete:
     *  delete:
     *      tags:
     *          - "admins"
     *      summary: Delete admin
     *      parameters:
     *        - name: admin_id
     *          in: "query"
     *          description: Delete admin
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
        controllers.v1.cmsControllers.adminsController.deleteAdmin,
    );

    /**
     * @openapi
     * /v1/cms/admins/password-forgot:
     *  put:
     *      tags:
     *          - "admins"
     *      summary: Admin forgot password
     *      parameters:
     *        - name: username_password
     *          in: "body"
     *          description: Send new password to admin when the admin fotgot password
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
        controllers.v1.cmsControllers.adminsController.sendEmail,
    );

    return router;
};

export default healthFacilityTypesRouter;
