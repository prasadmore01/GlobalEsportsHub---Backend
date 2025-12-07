
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import {
    NotFoundException,
    BadRequestException,
    ConflictException
} from "../exceptions/CustomExceptions";
import { TournamentRepository } from "../repositories/tournament.repository";
import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.dto";

export class TournamentController {
    /**
     * Get all tournaments with pagination and filters
     * GET /tournaments
     */
    async getAllTournaments(req: Request, res: Response) {
        try {
            const { page, limit, search, status, is_active } = req.query;

            const result = await TournamentRepository.getTournamentsWithPagination({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                search: search as string,
                status: status as string,
                is_active: is_active ? is_active === 'true' : undefined
            });

            return res.status(200).json({
                success: true,
                message: "Tournaments fetched successfully",
                ...result
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get tournament by ID
     * GET /users/:id
     */
    async getTournamentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestException("Invalid user ID");
            }

            const tournament = await TournamentRepository.findById(Number(id));

            if (!tournament || tournament.is_deleted) {
                throw new NotFoundException("Tournament not found");
            }

            return res.status(200).json({
                success: true,
                message: "Tournament fetched successfully",
                data: tournament
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get tournament by UUID
     * GET /tournaments/uuid/:uuid
     */
    async getTournamentByUuid(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const tournament = await TournamentRepository.findByUuid(uuid);

            if (!tournament || tournament.is_deleted) {
                throw new NotFoundException("Tournament not found");
            }

            return res.status(200).json({
                success: true,
                message: "Tournament fetched successfully",
                data: tournament
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new tournament
     * POST /tournaments
     */
    async createTournament(req: Request, res: Response) {
        try {
            const tournamentData: CreateTournamentDto = req.body;

            // Check if title already exists (if provided)
            if (tournamentData.title && await TournamentRepository.titleExists(tournamentData.title)) {
                throw new ConflictException("Title already exists");
            }

            const tournament = await TournamentRepository.create(tournamentData);

            return res.status(201).json({
                success: true,
                message: "Tournament created successfully",
                data: tournament
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update tournament
     * PUT /tournaments/:id
     */
    async updateTournament(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData: UpdateTournamentDto = req.body;

            if (!id) {
                throw new BadRequestException("Invalid user ID");
            }

            const tournament = await TournamentRepository.findByUuid(id);

            if (!tournament || tournament.is_deleted) {
                throw new NotFoundException("Tournament not found");
            }

            // Check title uniqueness if updating title
            if (updateData.title && updateData.title !== tournament.title) {
                if (await TournamentRepository.titleExists(updateData.title, tournament.id)) {
                    throw new ConflictException("Title already exists");
                }
            }

            const updatedTournament = await TournamentRepository.update(tournament.id, updateData);

            return res.status(200).json({
                success: true,
                message: "Tournament updated successfully",
                data: updatedTournament
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Soft delete tournament
     * DELETE /tournaments/:id
     */
    async deleteTournament(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestException("Invalid user ID");
            }

            const tournament = await TournamentRepository.findByUuid(id);

            if (!tournament || tournament.is_deleted) {
                throw new NotFoundException("Tournament not found");
            }

            const result = await TournamentRepository.softDelete(tournament.id);
            if (result) {
                await TournamentRepository.update(tournament.id, { is_deleted: true });
            }

            return res.status(200).json({
                success: true,
                message: "Tournament deleted successfully"
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Hard delete user (permanent)
     * DELETE /tournaments/:id/permanent
     */
    async permanentDeleteTournament(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestException("Invalid tournament ID");
            }

            const tournament = await TournamentRepository.findByUuid(id);

            if (!tournament) {
                throw new NotFoundException("Tournament not found");
            }

            await TournamentRepository.delete(tournament.id);

            return res.status(200).json({
                success: true,
                message: "Tournament permanently deleted"
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Restore soft deleted user
     * PATCH /tournaments/:id/restore
     */
    async restoreTournament(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestException("Invalid tournament ID");
            }


            const result = await TournamentRepository.restore(Number(id));

            if (result) {
                await TournamentRepository.update(Number(id), { is_deleted: false });
            }

            return res.status(200).json({
                success: true,
                message: "Tournament restored successfully",
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Bulk delete tournaments
     * POST /tournaments/bulk-delete
     */
    async bulkDeleteTournaments(req: Request, res: Response) {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                throw new BadRequestException("Invalid IDs array");
            }

            // Validate all IDs are numbers
            if (!ids.every(id => !isNaN(Number(id)))) {
                throw new BadRequestException("All IDs must be valid numbers");
            }

            await TournamentRepository.bulkDelete(ids);

            return res.status(200).json({
                success: true,
                message: `${ids.length} tournaments deleted successfully`
            });
        } catch (error) {
            throw error;
        }
    }
}