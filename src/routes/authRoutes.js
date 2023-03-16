const router = require('express').Router();
const { register, login, verify } = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         email: kaleatul9@gmail.com
 *         password: test
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    ResultSuccess:
 *      type: object
 *      required:
 *        - success
 *        - error
 *        - data
 *      properties:
 *        success:
 *          type: boolean
 *          description: The status of the request
 *        error:
 *          type: string
 *          nullable: true
 *          description: The error message of the request
 *        data:
 *          type: string
 *          nullable: true
 *          description: The response data of the request
 *      example:
 *        success: true
 *        error: null
 *        data: Operation Successful
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    ResultFail:
 *      type: object
 *      required:
 *        - success
 *        - error
 *        - data
 *      properties:
 *        success:
 *          type: boolean
 *          description: The status of the request
 *        error:
 *          type: string
 *          nullable: true
 *          description: The error message of the request
 *        data:
 *          type: string
 *          nullable: true
 *          description: The response data of the request
 *      example:
 *        success: false
 *        error: Error message
 *        data: null
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    cookieAuth:
 *      type: apiKey
 *      in: cookie
 *      name: jwtToken
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The users managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register a user and sent OTP to registered email id
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: A result object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultSuccess'
 *      403:
 *        description: Validation Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      409:
 *        description: User already exists!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 */

router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Login a user and sent JWT token cookie with response
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    security: []
 *    responses:
 *      200:
 *        description: A result object
 *        headers:
 *          Set-Cookie:
 *            schema:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTA1ODA3NGU4YzkwMTYyYWQyYmJkMiIsImlhdCI6MTY3ODk5MjYwMiwiZXhwIjoxNjc4OTkyOTAyfQ.Y18fOrxOVeiMwHl9VDL6UJSdhiSToyxoNSlnKU2B2jY; Path=/; HttpOnly
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultSuccess'
 *      403:
 *        description: Validation Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      409:
 *        description: User already exists!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 */

router.post('/login', login);

/**
 * @swagger
 * /api/auth/verify:
 *  post:
 *
 *    summary: Verify the user with valid OTP
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: Email of the user
 *              otp:
 *                type: integer
 *                description: OTP of the user
 *            example:
 *              email: kaleatul9@gmail.com
 *              otp: 123456
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: A result object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultSuccess'
 *            example:
 *              success: true
 *              error: null
 *              data: Login Successful
 *      401:
 *        description: OTP did not match!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      403:
 *        description: Validation Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 */

router.post('/verify', verify);

module.exports = router;
