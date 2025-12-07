
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import {
    NotFoundException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    HttpException
} from "../exceptions/CustomExceptions";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dtos/employee.dto";
import bcrypt from "bcrypt";
import { AuthHelper } from "../helpers/auth";
import { UserStatus } from "../entities/user.entity";
import { EmployeeRole, EmployeeStatus } from "../entities/employee.entity";
import { EmployeeSessionRepository } from "../repositories/employeeSession.repository";
export class EmployeeController {


    /**
     * Login an employee
     * POST /employees/login
     */
    async login(req: Request, res: Response) {
        try {
            const { email, mobile_number, password } = req.body;

            if (!email && !mobile_number) {
                throw new BadRequestException("Email or Mobile number is required");
            }

            if (!password) {
                throw new BadRequestException("Password is required");
            }

            const employee: any = await EmployeeRepository.findByEmailOrMobileNumberWithPassword(email, mobile_number);

            if (!employee) {
                throw new NotFoundException("Invalid email or mobile number");
            }

            const isPasswordValid = await bcrypt.compare(password, employee.password);

            if (!isPasswordValid) {
                throw new BadRequestException("Invalid password");
            }

            const token = await AuthHelper.generateToken(employee.id, employee.email, employee.mobile_number, employee.role);

            this.createEmployeeSession({
                employee_id: employee.id,
                token: token,
                device_id: req.headers['x-device-id'] as string,
                ip_address: req.ip,
                device_type: req.headers['x-device-type'] as string,
            });

            this.updateEmployeeLastLogin({
                id: employee.id,
                last_login_ip: req.ip,
                last_login_date: new Date().toISOString(),
                last_login_date_timestamp: new Date()
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    employee: {
                        id: employee.id,
                        email: employee.email,
                        mobile_number: employee.whatsapp_number,
                        role: employee.role,
                        status: employee.status
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create a new employee session
     */
    async createEmployeeSession(body: any) {
        try {
            const { employee_id, token, device_id, ip_address, device_type } = body;

            await EmployeeSessionRepository.create({
                employee_id: employee_id,
                token: token,
                device_id: device_id,
                ip_address: ip_address,
                device_type: device_type,
                expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
            });

            return {
                success: true,
                message: "Employee session created successfully",
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update an employee last login
     */
    async updateEmployeeLastLogin(body: any) {
        try {
            const { id, last_login_ip, last_login_date, last_login_date_timestamp } = body;

            await EmployeeRepository.update(id, {
                last_login_ip: last_login_ip,
                last_login_date: last_login_date,
                last_login_date_timestamp: last_login_date_timestamp
            });

            return {
                success: true,
                message: "Employee updated successfully",
            };

        } catch (error) {
            throw error;
        }
    }

    /**
     * Logout an employee
     * POST /employees/logout
     */
    async logout(req: Request, res: Response) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                throw new BadRequestException("Token is required");
            }

            const employeeSession = await EmployeeSessionRepository.findByToken(token);
            if (!employeeSession) {
                throw new NotFoundException("Employee session not found");
            }

            await EmployeeSessionRepository.delete(employeeSession.id);

            return res.status(200).json({
                success: true,
                message: "Employee logged out successfully",
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register a new employee
     * POST /employees/register
     */
    async register(req: Request, res: Response) {
        try {
            const employeeData: CreateEmployeeDto = req.body;

            if (!employeeData.email) {
                throw new BadRequestException("Email is required");
            }

            if (await EmployeeRepository.emailExists(employeeData.email)) {
                throw new ConflictException("Email already exists");
            }

            if (employeeData.whatsapp_number) {

                if (await EmployeeRepository.whatsappNumberExists(employeeData.whatsapp_number)) {
                    throw new ConflictException("Whatsapp number already exists");
                }
            } else {
                throw new BadRequestException("Whatsapp number is required");
            }

            if (!employeeData.password) {
                throw new BadRequestException("Password is required");
            }

            if (employeeData.password !== employeeData.confirm_password) {
                throw new BadRequestException("Password and confirm password do not match");
            }

            if (!employeeData.role) {
                throw new BadRequestException("Role is required");
            }

            const hashedPassword = await bcrypt.hash(employeeData.password, 10);

            employeeData.password = hashedPassword;
            employeeData.status = EmployeeStatus.ACTIVE;
            const employee = await EmployeeRepository.create(employeeData);


            if (employee) {
                return res.status(201).json({
                    success: true,
                    message: "Employee created successfully",
                    data: employee
                });
            }
            return res.status(400).json({
                success: false,
                message: "Failed to create employee",
                data: null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                data: null
            });
        }
    }


    /**
     * Get all employees with pagination and filters        
     * GET /employees
     */
    async getAllEmployees(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by ID
     * GET /users/:id
     */
    async getEmployeeById(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user by UUID
     * GET /users/uuid/:uuid
     */
    async getEmployeeByUuid(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new user
     * POST /users
     */
    async createEmployee(req: Request, res: Response) {
        try {
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


            if (employeeData.password && employeeData.password !== employeeData.confirm_password) {
                throw new BadRequestException("Password and confirm password do not match");
            }

            const hashedPassword = await bcrypt.hash(employeeData.password, 10);
            employeeData.password = hashedPassword;

            const employee = await EmployeeRepository.create(employeeData);

            return res.status(201).json({
                success: true,
                message: "Employee created successfully",
                data: employee
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user
     * PUT /users/:id
     */
    async updateEmployee(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Soft delete user
     * DELETE /users/:id
     */
    async deleteEmployee(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Hard delete user (permanent)
     * DELETE /users/:id/permanent
     */
    async permanentDeleteEmployee(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Restore soft deleted user
     * PATCH /users/:id/restore
     */
    async restoreEmployee(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestException("Invalid employee ID");
            }

            await EmployeeRepository.update(Number(id), { is_deleted: false, deleted_at: null });

            return res.status(200).json({
                success: true,
                message: "Employee restored successfully",
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Bulk delete users
     * POST /users/bulk-delete
     */
    async bulkDeleteEmployees(req: Request, res: Response) {
        try {
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
        } catch (error) {
            throw error;
        }
    }
}