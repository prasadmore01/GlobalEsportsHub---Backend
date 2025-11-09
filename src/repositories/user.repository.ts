// src/repositories/UserRepository.ts
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import { BaseRepository } from "./base.repository";

class UserRepositoryClass extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    /**
     * Find user by UUID
     */
    async findByUuid(uuid: string): Promise<User | null> {
        return await this.findOne({ uuid } as any);
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ email } as any);
    }

    /**
     * Find user by game_id
     */
    async findByGameId(gameId: string): Promise<User | null> {
        return await this.findOne({ game_id: gameId } as any);
    }

    /**
     * Find all active users
     */
    async findAllActive(): Promise<User[]> {
        return await this.findAll({
            is_active: true,
            is_deleted: false
        } as any);
    }

    /**
     * Get user with password (for authentication)
     */
    async findByEmailWithPassword(email: string): Promise<User | null> {
        return await this.getRepository()
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.email = :email", { email })
            .getOne();
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string, excludeId?: number): Promise<boolean> {
        const query = this.getRepository()
            .createQueryBuilder("user")
            .where("user.email = :email", { email });

        if (excludeId) {
            query.andWhere("user.id != :excludeId", { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    /**
     * Check if whatsapp number exists
     */
    async whatsappNumberExists(whatsappNumber: string, excludeId?: number): Promise<boolean> {
        const query = this.getRepository()
            .createQueryBuilder("user")
            .where("user.whatsapp_number = :whatsappNumber", { whatsappNumber });

        if (excludeId) {
            query.andWhere("user.id != :excludeId", { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    /**
     * Check if UPI ID exists
     */
    async upiIdExists(upiId: string, excludeId?: number): Promise<boolean> {
        const query = this.getRepository()
            .createQueryBuilder("user")
            .where("user.upi_id = :upiId", { upiId });

        if (excludeId) {
            query.andWhere("user.id != :excludeId", { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    /**
     * Check if UUID exists
     */
    async uuidExists(uuid: string, excludeId?: number): Promise<boolean> {
        const query = this.getRepository()
            .createQueryBuilder("user")
            .where("user.uuid = :uuid", { uuid });

        if (excludeId) {
            query.andWhere("user.id != :excludeId", { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }

    /**
     * Update last login
     */
    async updateLastLogin(id: number, ip: string): Promise<void> {
        await this.getRepository().update(id, {
            last_login_ip: ip,
            last_login_date: new Date().toISOString(),
            last_login_date_timestamp: new Date()
        } as any);
    }

    /**
     * Change user status
     */
    async changeStatus(id: number, status: string): Promise<User | null> {
        return await this.update(id, { status } as any);
    }

    /**
     * Get users with pagination and search
     * Searches in: game_name, first_name, last_name, email
     */
    async getUsersWithPagination(options: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        is_active?: boolean;
    }) {
        const { page = 1, limit = 10, search, status, is_active } = options;

        const additionalWhere: any = { is_deleted: false };

        if (status) additionalWhere.status = status;
        if (is_active !== undefined) additionalWhere.is_active = is_active;

        return await this.findAllWithPagination(
            {
                page,
                limit,
                search,
                searchFields: ['first_name', 'last_name', 'email', 'whatsapp_number', 'upi_id'],
                sortBy: 'created_at',
                sortOrder: 'DESC'
            },
            additionalWhere
        );
    }
}

// Export singleton instance
export const UserRepository = new UserRepositoryClass();