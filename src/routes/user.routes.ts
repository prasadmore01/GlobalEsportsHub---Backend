// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ExceptionFilter } from "../exceptions/ExceptionFilter";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

const router = Router();
const userController = new UserController();

// Wrap all routes with async handler to catch errors
const asyncHandler = ExceptionFilter.asyncHandler;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         country_code:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         whatsapp_number:
 *           type: string
 *         upi_id:
 *           type: string
 *         profile_picture:
 *           type: string
 *         is_active:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, BAN]
 *         role:
 *           type: string
 *         avatar:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         path:
 *           type: string
 *         method:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, BAN]
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by first name, last name, email, whatsapp number, or UPI ID
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", asyncHandler(userController.getAllUsers.bind(userController)));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", asyncHandler(userController.getUserById.bind(userController)));

/**
 * @swagger
 * /api/users/uuid/{uuid}:
 *   get:
 *     summary: Get user by UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/uuid/:uuid", asyncHandler(userController.getUserByUuid.bind(userController)));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country_code:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               whatsapp_number:
 *                 type: string
 *               password:
 *                 type: string
 *               upi_id:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (duplicate email/whatsapp number)
 */
router.post("/",
    validationMiddleware(CreateUserDto),
    asyncHandler(userController.createUser.bind(userController)));

/**
 * @swagger
 * /api/users/bulk-delete:
 *   post:
 *     summary: Bulk delete users
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Users deleted successfully
 */
router.post("/bulk-delete", asyncHandler(userController.bulkDeleteUsers.bind(userController)));

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.patch("/:id", validationMiddleware(UpdateUserDto), asyncHandler(userController.updateUser.bind(userController)));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", asyncHandler(userController.deleteUser.bind(userController)));

/**
 * @swagger
 * /api/users/{id}/permanent:
 *   delete:
 *     summary: Permanently delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User permanently deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id/permanent", asyncHandler(userController.permanentDeleteUser.bind(userController)));

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restore soft deleted user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored successfully
 */
router.patch("/:id/restore", asyncHandler(userController.restoreUser.bind(userController)));

export default router;