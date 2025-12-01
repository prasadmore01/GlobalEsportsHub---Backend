import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated
} from "typeorm";

export enum TournamentStatus {
    UPCOMING = "UPCOMING",
    LIVE = "LIVE",
    CLOSED = "CLOSED",
    REMOVED = "REMOVED"
}

@Entity("tournaments")
export class Tournament {

    @PrimaryGeneratedColumn()
    id: number; // Auto-increment integer ID

    @Generated("uuid")
    @Column({ type: "uuid", unique: true })
    uuid: string; // Auto-generated unique UUID

    @Column({ nullable: true })
    title?: string;

    @Column({ nullable: true })
    tagline?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    type?: string;

    @Column({ nullable: true })
    entry_fee?: string;

    @Column({ nullable: true })
    prizepool?: string;

    @Column({ nullable: true })
    first_prize?: string;

    @Column({ nullable: true })
    second_prize?: string;

    @Column({ nullable: true })
    third_prize?: string;

    @Column({ nullable: true })
    max_participants?: number;

    @Column({ nullable: true })
    min_participants?: number;

    @Column({ nullable: true })
    max_teams?: number;

    @Column({ nullable: true })
    min_teams?: number;

    @Column({ nullable: true })
    tournament_start_date?: string;

    @Column({ nullable: true })
    tournament_end_date?: string;

    @Column({ nullable: true })
    registration_start_date?: string;

    @Column({ nullable: true })
    registration_end_date?: string;

    @Column({ type: "jsonb", nullable: true })
    rules?: any

    @Column({ default: true })
    is_active?: boolean;

    @Column({ default: false })
    is_deleted?: boolean;

    @DeleteDateColumn({ nullable: true })
    deleted_at?: Date;

    @Column({ nullable: true })
    created_by?: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @Column({ nullable: true })
    updated_by?: string;


    @Column({
        type: "enum",
        enum: TournamentStatus,
        default: TournamentStatus.UPCOMING
    })
    status?: TournamentStatus;

}