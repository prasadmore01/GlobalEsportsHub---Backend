
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import {
    NotFoundException,
    BadRequestException,
    ConflictException
} from "../exceptions/CustomExceptions";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dtos/employee.dto";

export class EmployeeController {
    /**
     * Get all employees with pagination and filters        
     * GET /employees
     */
    async getAllEmployees(req: Request, res: Response) {
        const { page, limit, search, status, is_active } = req.query;

        const result = await EmployeeRepository.getEmployeesWithPagination({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search as string,
            status: status as string,
            is_active: is_active ? is_active === 'true' : undefined
        });

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            ...result
        });
    }

    /**
     * Get user by ID
     * GET /users/:id
     */
    async getEmployeeById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid employee ID");
        }

        const employee = await EmployeeRepository.findById(Number(id));

        if (!employee || employee.is_deleted) {
            throw new NotFoundException("Employee not found");
        }

        return res.status(200).json({
            success: true,
            message: "Employee fetched successfully",
            data: employee
        });
    }

    /**
     * Get user by UUID
     * GET /users/uuid/:uuid
     */
    async getEmployeeByUuid(req: Request, res: Response) {
        const { uuid } = req.params;
        const employee = await EmployeeRepository.findByUuid(uuid);

        if (!employee || employee.is_deleted) {
            throw new NotFoundException("Employee not found");
        }

        return res.status(200).json({
            success: true,
            message: "Employee fetched successfully",
            data: employee
        });
    }

    /**
     * Create new user
     * POST /users
     */
    async createEmployee(req: Request, res: Response) {
        const employeeData: CreateEmployeeDto = req.body;

        if (!employeeData.email) {
            throw new BadRequestException(
                "Email is required"
            );
        }

        // Check if email already exists (if provided)
        if (employeeData.email && await EmployeeRepository.emailExists(employeeData.email)) {
            throw new ConflictException("Email already exists");
        }

        //Check if whatsapp number already exists
        if (employeeData.whatsapp_number && await EmployeeRepository.whatsappNumberExists(employeeData.whatsapp_number)) {
            throw new ConflictException("Whatsapp number already exists");
        }

        const employee = await EmployeeRepository.create(employeeData);

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        });
    }

    /**
     * Update user
     * PUT /users/:id
     */
    async updateEmployee(req: Request, res: Response) {
        const { id } = req.params;
        const updateData: UpdateEmployeeDto = req.body;

        if (!id) {
            throw new BadRequestException("Invalid employee ID");
        }

        const employee = await EmployeeRepository.findByUuid(id);

        if (!employee || employee.is_deleted) {
            throw new NotFoundException("Employee not found");
        }

        // Check email uniqueness if updating email
        if (updateData.email && updateData.email !== employee.email) {
            if (await EmployeeRepository.emailExists(updateData.email, employee.id)) {
                throw new ConflictException("Email already exists");
            }
        }

        //Check if whatsapp number already exists
        if (updateData.whatsapp_number && updateData.whatsapp_number !== employee.whatsapp_number) {
            if (await EmployeeRepository.whatsappNumberExists(updateData.whatsapp_number, employee.id)) {
                throw new ConflictException("Whatsapp number already exists");
            }
        }

        const updatedEmployee = await EmployeeRepository.update(employee.id, updateData);

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee
        });
    }

    /**
     * Soft delete user
     * DELETE /users/:id
     */
    async deleteEmployee(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid employee ID");
        }

        const employee = await EmployeeRepository.findByUuid(id);

        if (!employee || employee.is_deleted) {
            throw new NotFoundException("Employee not found");
        }

        await EmployeeRepository.update(employee.id, { is_deleted: true, deleted_at: new Date() });

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    }

    /**
     * Hard delete user (permanent)
     * DELETE /users/:id/permanent
     */
    async permanentDeleteEmployee(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid employee ID");
        }

        const employee = await EmployeeRepository.findByUuid(id);

        if (!employee) {
            throw new NotFoundException("Employee not found");
        }

        await EmployeeRepository.delete(employee.id);

        return res.status(200).json({
            success: true,
            message: "Employee permanently deleted"
        });
    }

    /**
     * Restore soft deleted user
     * PATCH /users/:id/restore
     */
    async restoreEmployee(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid employee ID");
        }

        await EmployeeRepository.update(Number(id), { is_deleted: false, deleted_at: null });

        return res.status(200).json({
            success: true,
            message: "Employee restored successfully",
        });
    }

    /**
     * Bulk delete users
     * POST /users/bulk-delete
     */
    async bulkDeleteEmployees(req: Request, res: Response) {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            throw new BadRequestException("Invalid IDs array");
        }

        // Validate all IDs are numbers
        if (!ids.every(id => !isNaN(Number(id)))) {
            throw new BadRequestException("All IDs must be valid numbers");
        }

        await EmployeeRepository.bulkDelete(ids);

        return res.status(200).json({
            success: true,
            message: `${ids.length} employees deleted successfully`
        });
    }
}