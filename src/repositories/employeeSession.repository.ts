// src/repositories/UserRepository.ts
import { AppDataSource } from "../config/database";
import { EmployeeSession } from "../entities/employeeSession.entity";
import { BaseRepository } from "./base.repository";

class EmployeeSessionRepositoryClass extends BaseRepository<EmployeeSession> {
    constructor() {
        super(AppDataSource.getRepository(EmployeeSession));
    }

    /**
     * Find session by token
     */
    async findByToken(token: string): Promise<EmployeeSession | null> {
        return await this.findOne({ token } as any);
    }

    /**
     * Find session by device_id
     */
    async findByDeviceId(device_id: string): Promise<EmployeeSession | null> {
        return await this.findOne({ device_id } as any);
    }

    /**
     * Find session by ip_address
     */
    async findByIpAddress(ip_address: string): Promise<EmployeeSession | null> {
        return await this.findOne({ ip_address } as any);
    }


    /**
     * Find session by device_type
     */
    async findByDeviceType(device_type: string): Promise<EmployeeSession | null> {
        return await this.findOne({ device_type } as any);
    }

    /**
     * Check if employee exists
     */
    async findByEmployeeId(employee_id: string): Promise<EmployeeSession | null> {
        return await this.findOne({ employee_id } as any);
    }

    /**
     * Delete session by employee_id
     * Hard delete
     */
    async deleteByEmployeeId(employee_id: string): Promise<boolean> {
        return await this.delete({ employee_id } as any);
    }

}

// Export singleton instance
export const EmployeeSessionRepository = new EmployeeSessionRepositoryClass();