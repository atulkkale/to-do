const router = require('express').Router();
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');
const {
  createTask,
  updateTask,
  getTasks,
  rearrangeTasks,
  deleteTask,
} = require('../controllers/taskController');

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
 *  name: Tasks
 *  description: The tasks managing API
 */

/**
 * @swagger
 * /api/task/create:
 *  post:
 *    summary: Created the task for user
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              taskName:
 *                type: string
 *              taskDate:
 *                type: string
 *                format: date
 *              taskStatus:
 *                type: string
 *            example:
 *              taskName: shopping
 *              taskDate: 3-25-2023
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: Task successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultSuccess'
 *      401:
 *        description: Unauthorized
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
 *      409:
 *        description: Task already exists!
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

router.post('/create', cookieJwtAuth, createTask);

/**
 * @swagger
 * /api/task/update/{id}:
 *  patch:
 *    summary: Updated the task for user
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The task id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              taskName:
 *                type: string
 *              taskDate:
 *                type: string
 *                format: date
 *              taskStatus:
 *                type: string
 *            example:
 *              taskName: shopping
 *              taskDate: 3-25-2023
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: Task successfully created
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
 *      404:
 *        description: Task not found!
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

router.patch('/update/:id', cookieJwtAuth, updateTask);

/**
 * @swagger
 * /api/task/list:
 *  get:
 *    summary: Get the all tasks of the user
 *    tags: [Tasks]
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Requested page number
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Requested limit number
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: Task successfully created
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
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 */

router.get('/list', cookieJwtAuth, getTasks);

/**
 * @swagger
 * /api/task/rearrange:
 *  patch:
 *    summary: Rearrange the tasks provided by user
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *            example: ["shopping", "exercising", "meditation"]
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: Task successfully created
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
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 */

router.patch('/rearrange', cookieJwtAuth, rearrangeTasks);

/**
 * @swagger
 * /api/task/delete/{id}:
 *  delete:
 *    summary: Delete the task of the user
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The task id
 *    security:
 *      - cookieAuth: []
 *    responses:
 *      200:
 *        description: Task successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultSuccess'
 *      403:
 *        description: Invalid Request Id!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResultFail'
 *      404:
 *        description: Task not found!
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

router.delete('/delete/:id', cookieJwtAuth, deleteTask);

module.exports = router;
