// src/routes/userRoutes.ts
import { Router } from "express";
import { TournamentController } from "../controllers/tournament.controller";
import { ExceptionFilter } from "../exceptions/ExceptionFilter";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.dto";

const router = Router();
const tournamentController = new TournamentController();

// Wrap all routes with async handler to catch errors
const asyncHandler = ExceptionFilter.asyncHandler;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         tagline:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         entry_fee:
 *           type: string
 *         prizepool:
 *           type: string
 *         first_prize:
 *           type: string
 *         second_prize:
 *           type: string
 *         third_prize:
 *           type: string
 *         max_participants:
 *           type: integer
 *         min_participants:
 *           type: integer
 *         max_teams:
 *           type: integer
 *         min_teams:
 *           type: integer
 *         tournament_start_date:
 *           type: string
 *         tournament_end_date:
 *           type: string
 *         registration_start_date:
 *           type: string
 *         registration_end_date:
 *           type: string
 *         rules:
 *           type: object
 *         status:
 *           type: string
 *           enum: [UPCOMING, LIVE, CLOSED, REMOVED]
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
    * /api/tournaments:
 *   get:
 *     summary: Get all tournaments
 *     tags: [Tournaments]
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
 *           enum: [UPCOMING, LIVE, CLOSED, REMOVED]
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, tagline, description, type, entry_fee, prizepool, first_prize, second_prize, third_prize, max_participants, min_participants, max_teams, min_teams, tournament_start_date, tournament_end_date, registration_start_date, registration_end_date, rules
 *     responses:
 *       200:
 *         description: List of tournaments
 */
router.get("/", asyncHandler(tournamentController.getAllTournaments.bind(tournamentController)));

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     summary: Get tournament by ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tournament details
 *       404:
 *         description: Tournament not found
 */
router.get("/:id", asyncHandler(tournamentController.getTournamentById.bind(tournamentController)));

/**
 * @swagger
 * /api/tournaments/uuid/{uuid}:
 *   get:
 *     summary: Get tournament by UUID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament details
 *       404:
 *         description: Tournament not found
 */
router.get("/uuid/:uuid", asyncHandler(tournamentController.getTournamentByUuid.bind(tournamentController)));

/**
 * @swagger
    * /api/tournaments:
 *   post:
 *     summary: Create new tournament
 *     tags: [Tournaments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               entry_fee:
 *                 type: string
 *               prizepool:
 *                 type: string
 *               first_prize:
 *                 type: string
 *               second_prize:
 *                 type: string
 *               third_prize:
 *                 type: string
 *               max_participants:
 *                 type: integer
 *               min_participants:
 *                 type: integer
 *               max_teams:
 *                 type: integer
 *               min_teams:
 *                 type: integer
 *               tournament_start_date:
 *                 type: string
 *               tournament_end_date:
 *                 type: string
 *               registration_start_date:
 *                 type: string
 *               registration_end_date:
 *                 type: string
 *               rules:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [UPCOMING, LIVE, CLOSED, REMOVED]

 *     responses:
 *       201:
 *         description: Tournament created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (duplicate title)
 */
router.post("/",
    validationMiddleware(CreateTournamentDto),
    asyncHandler(tournamentController.createTournament.bind(tournamentController)));

/**
 * @swagger
    * /api/tournaments/bulk-delete:
 *   post:
 *     summary: Bulk delete tournaments
 *     tags: [Tournaments]
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
 *         description: Tournaments deleted successfully
 */
router.post("/bulk-delete", asyncHandler(tournamentController.bulkDeleteTournaments.bind(tournamentController)));

/**
 * @swagger
 * /api/tournaments/{id}:
 *   patch:
 *     summary: Update tournament
 *     tags: [Tournaments]
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
 *         description: Tournament updated successfully
 *       404:
 *         description: Tournament not found
 */
router.patch("/:id", validationMiddleware(UpdateTournamentDto), asyncHandler(tournamentController.updateTournament.bind(tournamentController)));

/**
 * @swagger
    * /api/tournaments/{id}:
 *   delete:
 *     summary: Soft delete tournament
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament deleted successfully
 *       404:
 *         description: Tournament not found
 */
router.delete("/:id", asyncHandler(tournamentController.deleteTournament.bind(tournamentController)));

/**
 * @swagger
 * /api/tournaments/{id}/permanent:
 *   delete:
 *     summary: Permanently delete tournament
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament permanently deleted
 *       404:
 *         description: Tournament not found
 */
router.delete("/:id/permanent", asyncHandler(tournamentController.permanentDeleteTournament.bind(tournamentController)));

/**
 * @swagger
 * /api/tournaments/{id}/restore:
 *   patch:
 *     summary: Restore soft deleted tournament
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
    *         description: Tournament restored successfully
 */
router.patch("/:id/restore", asyncHandler(tournamentController.restoreTournament.bind(tournamentController)));

export default router;