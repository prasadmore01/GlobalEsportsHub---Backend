// src/routes/userRoutes.ts
import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { ExceptionFilter } from "../exceptions/ExceptionFilter";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dtos/employee.dto";

const router = Router();
const employeeController = new EmployeeController();

// Wrap all routes with async handler to catch errors
const asyncHandler = ExceptionFilter.asyncHandler;

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         whatsapp_number:
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
 * /api/employees/login:
 *   post:
 *     summary: Login an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               password:
 *                 type: string

 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

router.post("/login", asyncHandler(employeeController.login.bind(employeeController)));


/**
 * @swagger
 * /api/employees/register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               confirm_password:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED, BAN]
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (duplicate email/whatsapp number)
 *       500:
 *         description: Internal server error
 */
router.post("/register", validationMiddleware(CreateEmployeeDto), asyncHandler(employeeController.register.bind(employeeController)));

/**
 * @swagger
 * /api/employees/logout:
 *   post:
 *     summary: Logout an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee logged out successfully
 */

router.post("/logout", asyncHandler(employeeController.logout.bind(employeeController)));

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
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
 *         description: Search by first name, last name, email, whatsapp number,
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get("/", asyncHandler(employeeController.getAllEmployees.bind(employeeController)));

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get("/:id", asyncHandler(employeeController.getEmployeeById.bind(employeeController)));

/**
 * @swagger
 * /api/employees/uuid/{uuid}:
 *   get:
 *     summary: Get employee by UUID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get("/uuid/:uuid", asyncHandler(employeeController.getEmployeeByUuid.bind(employeeController)));

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED, BAN]
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (duplicate email/whatsapp number)
 */
router.post("/",
    validationMiddleware(CreateEmployeeDto),
    asyncHandler(employeeController.createEmployee.bind(employeeController)));

/**
 * @swagger
 * /api/employees/bulk-delete:
 *   post:
 *     summary: Bulk delete employees
 *     tags: [Employees]
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
 *         description: Employees deleted successfully
 */
router.post("/bulk-delete", asyncHandler(employeeController.bulkDeleteEmployees.bind(employeeController)));

/**
 * @swagger
 * /api/employees/{id}:
 *   patch:
 *     summary: Update employee
 *     tags: [Employees]
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
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */
router.patch("/:id", validationMiddleware(UpdateEmployeeDto), asyncHandler(employeeController.updateEmployee.bind(employeeController)));

/**
 * @swagger
    * /api/employees/{id}:
 *   delete:
 *     summary: Soft delete employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete("/:id", asyncHandler(employeeController.deleteEmployee.bind(employeeController)));

/**
 * @swagger
 * /api/employees/{id}/permanent:
 *   delete:
 *     summary: Permanently delete employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee permanently deleted
 *       404:
 *         description: Employee not found
 */
router.delete("/:id/permanent", asyncHandler(employeeController.permanentDeleteEmployee.bind(employeeController)));

/**
 * @swagger
 * /api/employees/{id}/restore:
 *   patch:
 *     summary: Restore soft deleted employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee restored successfully
 */
router.patch("/:id/restore", asyncHandler(employeeController.restoreEmployee.bind(employeeController)));

export default router;