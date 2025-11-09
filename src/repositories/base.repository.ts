// src/repositories/BaseRepository.ts
import { Repository, FindOptionsWhere, ILike, ObjectLiteral } from "typeorm";

export interface PaginationOptions {
    page?: number;
    limit?: number;
    search?: string;
    searchFields?: string[];
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class BaseRepository<T extends ObjectLiteral> {
    constructor(private repository: Repository<T>) { }

    /**
     * Find all records with pagination and search
     */
    async findAllWithPagination(
        options: PaginationOptions = {},
        additionalWhere: FindOptionsWhere<T> = {}
    ): Promise<PaginationResult<T>> {
        const {
            page = 1,
            limit = 10,
            search = "",
            searchFields = [],
            sortBy = "created_at",
            sortOrder = "DESC"
        } = options;

        const skip = (page - 1) * limit;

        // Apply search filter if search text and fields are provided
        let where: FindOptionsWhere<T> | FindOptionsWhere<T>[];

        if (search && searchFields.length > 0) {
            // Create an array of where conditions, one for each search field
            where = searchFields.map(field => ({
                ...additionalWhere,
                [field]: ILike(`%${search}%`)
            })) as FindOptionsWhere<T>[];
        } else {
            where = additionalWhere;
        }

        console.log("where", where);

        const [data, total] = await this.repository.findAndCount({
            where,
            skip,
            take: limit,
            order: { [sortBy]: sortOrder } as any
        });

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    /**
     * Find one by ID
     */
    async findById(id: number): Promise<T | null> {
        return await this.repository.findOne({ where: { id } as any });
    }

    /**
     * Find one by condition
     */
    async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
        console.log("where", where);
        return await this.repository.findOne({ where });
    }

    /**
     * Find all by condition
     */
    async findAll(where: FindOptionsWhere<T> = {}): Promise<T[]> {
        return await this.repository.find({ where });
    }

    /**
     * Create a new record
     */
    async create(data: Partial<T>): Promise<T> {
        const entity: any = this.repository.create(data as any);
        return await this.repository.save(entity);
    }

    /**
     * Update a record by ID
     */
    async update(id: number, data: Partial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return await this.findById(id);
    }

    /**
     * Delete a record by ID (hard delete)
     */
    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Soft delete a record by ID
     */
    async softDelete(id: number): Promise<boolean> {
        const result = await this.repository.softDelete(id);
        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Restore a soft-deleted record
     */
    async restore(id: number): Promise<boolean> {
        const result = await this.repository.restore(id);
        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Check if record exists
     */
    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repository.count({ where });
        return count > 0;
    }

    /**
     * Count records
     */
    async count(where: FindOptionsWhere<T> = {}): Promise<number> {
        return await this.repository.count({ where });
    }

    /**
     * Bulk create records
     */
    async bulkCreate(data: Partial<T>[]): Promise<T[]> {
        const entities = this.repository.create(data as any);
        return await this.repository.save(entities);
    }

    /**
     * Bulk update records
     */
    async bulkUpdate(ids: number[], data: Partial<T>): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder()
            .update()
            .set(data as any)
            .whereInIds(ids)
            .execute();
        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Bulk delete records
     */
    async bulkDelete(ids: number[]): Promise<boolean> {
        const result = await this.repository.delete(ids);
        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Get repository instance for advanced queries
     */
    getRepository(): Repository<T> {
        return this.repository;
    }
}