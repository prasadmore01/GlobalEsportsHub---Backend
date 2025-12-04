// src/repositories/UserRepository.ts
import { AppDataSource } from "../config/database";
import { Session } from "../entities/session.entity";
import { BaseRepository } from "./base.repository";

class SessionRepositoryClass extends BaseRepository<Session> {
    constructor() {
        super(AppDataSource.getRepository(Session));
    }

    /**
     * Find session by token
     */
    async findByToken(token: string): Promise<Session | null> {
        return await this.findOne({ token } as any);
    }

    /**
     * Find session by device_id
     */
    async findByDeviceId(device_id: string): Promise<Session | null> {
        return await this.findOne({ device_id } as any);
    }

    /**
     * Find session by ip_address
     */
    async findByIpAddress(ip_address: string): Promise<Session | null> {
        return await this.findOne({ ip_address } as any);
    }


    /**
     * Find session by device_type
     */
    async findByDeviceType(device_type: string): Promise<Session | null> {
        return await this.findOne({ device_type } as any);
    }

    /**
     * Check if email exists
     */
    async findByUserId(user_id: string): Promise<Session | null> {
        return await this.findOne({ user_id } as any);
    }

    /**
     * Delete session by user_id
     * Hard delete
     */
    async deleteByUserId(user_id: string): Promise<boolean> {
        return await this.delete({ user_id } as any);
    }

}

// Export singleton instance
export const SessionRepository = new SessionRepositoryClass();