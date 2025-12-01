// src/repositories/UserRepository.ts
import { AppDataSource } from "../config/database";
import { Tournament } from "../entities/tournament.entity";
import { BaseRepository } from "./base.repository";

class TournamentRepositoryClass extends BaseRepository<Tournament> {
    constructor() {
        super(AppDataSource.getRepository(Tournament));
    }

    /**
     * Find user by UUID
     */
    async findByUuid(uuid: string): Promise<Tournament | null> {
        return await this.findOne({ uuid } as any);
    }

    /**
     * Find all active users
     */
    async findAllActive(): Promise<Tournament[]> {
        return await this.findAll({
            is_active: true,
            is_deleted: false
        } as any);
    }

    /**
     * Check if email exists
     */
    async titleExists(title: string, excludeId?: number): Promise<boolean> {
        const query = this.getRepository()
            .createQueryBuilder("tournament")
            .where("tournament.title = :title", { title });

        if (excludeId) {
            query.andWhere("tournament.id != :excludeId", { excludeId });
        }

        const count = await query.getCount();
        return count > 0;
    }


    /**
     * Change user status
     */
    async changeStatus(id: number, status: string): Promise<Tournament | null> {
        return await this.update(id, { status } as any);
    }

    /**
     * Get tournaments with pagination and search
     * Searches in: title, tagline, description, type, entry_fee, prizepool, first_prize, second_prize, third_prize, max_participants, min_participants, max_teams, min_teams, tournament_start_date, tournament_end_date, registration_start_date, registration_end_date, rules
     */
    async getTournamentsWithPagination(options: {
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
                searchFields: ['title', 'tagline', 'description', 'type', 'entry_fee', 'prizepool', 'first_prize', 'second_prize', 'third_prize', 'max_participants', 'min_participants', 'max_teams', 'min_teams', 'tournament_start_date', 'tournament_end_date', 'registration_start_date', 'registration_end_date', 'rules'],
                sortBy: 'created_at',
                sortOrder: 'DESC'
            },
            additionalWhere
        );
    }
}

// Export singleton instance
export const TournamentRepository = new TournamentRepositoryClass();