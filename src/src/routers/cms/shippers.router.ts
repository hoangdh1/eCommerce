import { Router } from 'express';
import { ICradle } from 'src/container';

export const healthFacilityTypesRouter = ({
    controllers,
    middlewares,
}: ICradle) => {
    const router = Router();

    const { rateLimitMiddleware, authMiddleware } = middlewares;

    /**
     * @openapi
     * /v1/cms/shippers/info:
     *  get:
     *      tags:
     *          - "shippers"
     *      summary: Get info shipper
     *      parameters:
     *        - name: shipper_id
     *          in: "query"
     *          description: Get info shipper
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
     *                          $ref: "#/definitions/ShipperInfo"
     */

    /**
     * @openapi
     * definitions:
     *      ShipperInfo:
     *          properties:
     *              id:
     *                  type: string
     *              username:
     *                  type: string
     *              email:
     *                  type: string
     *              phone:
     *                  type: string
     *              status:
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
        controllers.v1.cmsControllers.shippersController.getBasicInfo,
    );

    /**
     * @openapi
     * /v1/cms/shippers/register:
     *  post:
     *      tags:
     *          - "shippers"
     *      summary: Register shipper
     *      parameters:
     *        - name: shipper_info
     *          in: "body"
     *          description: Registry shipper
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
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.shippersController.createNewShipper,
    );

    /**
     * @openapi
     * /v1/cms/shippers/login:
     *  put:
     *      tags:
     *          - "shippers"
     *      summary: Shipper login
     *      parameters:
     *        - name: shipper_login_info
     *          in: "body"
     *          description: Shipper login
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
     *                          $ref: "#/definitions/Shipper"
     *                      token:
     *                          type: string
     */

    /**
     * @openapi
     * definitions:
     *      Shipper:
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
     *              status:
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
            rateLimitMiddleware.checkLogin(req, res, next, 'shipper');
        },
        (req, res, next) => {
            rateLimitMiddleware.rateLimitLogin(req, res, next);
        },
        controllers.v1.cmsControllers.shippersController.login,
    );

    /**
     * @openapi
     * /v1/cms/shippers/update:
     *  put:
     *      tags:
     *          - "shippers"
     *      summary: Update shipper
     *      parameters:
     *        - name: update_data
     *          in: "body"
     *          description: Update info for shipper
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
     *                          $ref: "#/definitions/Shipper"
     */
    router.put(
        '/update',
        controllers.v1.cmsControllers.shippersController.updateShipper,
    );

    /**
     * @openapi
     * /v1/cms/shippers/delete:
     *  delete:
     *      tags:
     *          - "shippers"
     *      summary: Delete shipper
     *      parameters:
     *        - name: shipper_id
     *          in: "query"
     *          description: Delete shipper
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
        controllers.v1.cmsControllers.shippersController.deleteShipper,
    );

    /**
     * @openapi
     * /v1/cms/shippers/password-forgot:
     *  put:
     *      tags:
     *          - "shippers"
     *      summary: Shipper forgot password
     *      parameters:
     *        - name: username_password
     *          in: "body"
     *          description: Send new password to shipper when the shipper fotgot password
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
        controllers.v1.cmsControllers.shippersController.sendEmail,
    );

    // Permission for admin

    /**
     * @openapi
     * /v1/cms/shippers/deactive-shipper:
     *  put:
     *      tags:
     *          - "shippers"
     *      summary: Deactive shipper
     *      parameters:
     *        - name: shipper_id
     *          in: "query"
     *          description: Deactive shipper
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
     *                          $ref: "#/definitions/Shipper"
     */
    router.put(
        '/deactive-shipper',
        authMiddleware.authAdmin,
        controllers.v1.cmsControllers.shippersController.deactiveShipper,
    );

    return router;
};

export default healthFacilityTypesRouter;
