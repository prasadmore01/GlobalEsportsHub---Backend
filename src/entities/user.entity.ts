import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated
} from "typeorm";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    BAN = "BAN"
}

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number; // Auto-increment integer ID

    @Generated("uuid")
    @Column({ type: "uuid", unique: true })
    uuid: string; // Auto-generated unique UUID

    @Column({ nullable: true })
    first_name?: string;

    @Column({ nullable: true })
    last_name?: string;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column({ nullable: true })
    whatsapp_number?: string;

    @Column({ nullable: true, select: false })
    password?: string;

    @Column({ nullable: true })
    reset_password_token?: string;

    @Column({ nullable: true })
    last_login_ip?: string;

    @Column({ nullable: true })
    last_login_date?: string;

    @Column({ type: "timestamp", nullable: true })
    last_login_date_timestamp?: Date;

    @Column({ nullable: true })
    upi_id?: string;

    @Column({ nullable: true })
    profile_picture?: string;

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

    @Column({ nullable: true })
    role?: string;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status?: UserStatus;

    @Column({ nullable: true })
    is_verified?: boolean;

    @Column({ nullable: true })
    country_code?: string;

    @Column({ nullable: true })
    avatar?: string;
}