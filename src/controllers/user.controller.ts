
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import {
    NotFoundException,
    BadRequestException,
    ConflictException
} from "../exceptions/CustomExceptions";

export class UserController {
    /**
     * Get all users with pagination and filters
     * GET /users
     */
    async getAllUsers(req: Request, res: Response) {
        const { page, limit, search, status, is_active } = req.query;

        const result = await UserRepository.getUsersWithPagination({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search as string,
            status: status as string,
            is_active: is_active ? is_active === 'true' : undefined
        });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            ...result
        });
    }

    /**
     * Get user by ID
     * GET /users/:id
     */
    async getUserById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid user ID");
        }

        const user = await UserRepository.findById(Number(id));

        if (!user || user.is_deleted) {
            throw new NotFoundException("User not found");
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    }

    /**
     * Get user by UUID
     * GET /users/uuid/:uuid
     */
    async getUserByUuid(req: Request, res: Response) {
        const { uuid } = req.params;
        const user = await UserRepository.findByUuid(uuid);

        if (!user || user.is_deleted) {
            throw new NotFoundException("User not found");
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    }

    /**
     * Create new user
     * POST /users
     */
    async createUser(req: Request, res: Response) {
        const userData: CreateUserDto = req.body;

        if (!userData.email) {
            throw new BadRequestException(
                "Email is required"
            );
        }

        // Check if email already exists (if provided)
        if (userData.email && await UserRepository.emailExists(userData.email)) {
            throw new ConflictException("Email already exists");
        }

        //Check if whatsapp number already exists
        if (userData.whatsapp_number && await UserRepository.whatsappNumberExists(userData.whatsapp_number)) {
            throw new ConflictException("Whatsapp number already exists");
        }

        //Check if UPI ID already exists
        if (userData.upi_id && await UserRepository.upiIdExists(userData.upi_id)) {
            throw new ConflictException("UPI ID already exists");
        }

        const user = await UserRepository.create(userData);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    }

    /**
     * Update user
     * PUT /users/:id
     */
    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const updateData: UpdateUserDto = req.body;

        if (!id) {
            throw new BadRequestException("Invalid user ID");
        }

        const user = await UserRepository.findByUuid(id);

        if (!user || user.is_deleted) {
            throw new NotFoundException("User not found");
        }

        // Check email uniqueness if updating email
        if (updateData.email && updateData.email !== user.email) {
            if (await UserRepository.emailExists(updateData.email, user.id)) {
                throw new ConflictException("Email already exists");
            }
        }

        //Check if UPI ID already exists
        if (updateData.upi_id && updateData.upi_id !== user.upi_id) {
            if (await UserRepository.upiIdExists(updateData.upi_id, user.id)) {
                throw new ConflictException("UPI ID already exists");
            }
        }

        //Check if whatsapp number already exists
        if (updateData.whatsapp_number && updateData.whatsapp_number !== user.whatsapp_number) {
            if (await UserRepository.whatsappNumberExists(updateData.whatsapp_number, user.id)) {
                throw new ConflictException("Whatsapp number already exists");
            }
        }

        const updatedUser = await UserRepository.update(user.id, updateData);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    }

    /**
     * Soft delete user
     * DELETE /users/:id
     */
    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid user ID");
        }

        const user = await UserRepository.findByUuid(id);

        if (!user || user.is_deleted) {
            throw new NotFoundException("User not found");
        }

        const result = await UserRepository.softDelete(user.id);
        if (result) {
            await UserRepository.update(user.id, { is_deleted: true });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }

    /**
     * Hard delete user (permanent)
     * DELETE /users/:id/permanent
     */
    async permanentDeleteUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid user ID");
        }

        const user = await UserRepository.findByUuid(id);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        await UserRepository.delete(user.id);

        return res.status(200).json({
            success: true,
            message: "User permanently deleted"
        });
    }

    /**
     * Restore soft deleted user
     * PATCH /users/:id/restore
     */
    async restoreUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestException("Invalid user ID");
        }


        const result = await UserRepository.restore(Number(id));

        if (result) {
            await UserRepository.update(Number(id), { is_deleted: false });
        }

        return res.status(200).json({
            success: true,
            message: "User restored successfully",
        });
    }

    /**
     * Bulk delete users
     * POST /users/bulk-delete
     */
    async bulkDeleteUsers(req: Request, res: Response) {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            throw new BadRequestException("Invalid IDs array");
        }

        // Validate all IDs are numbers
        if (!ids.every(id => !isNaN(Number(id)))) {
            throw new BadRequestException("All IDs must be valid numbers");
        }

        await UserRepository.bulkDelete(ids);

        return res.status(200).json({
            success: true,
            message: `${ids.length} users deleted successfully`
        });
    }
}