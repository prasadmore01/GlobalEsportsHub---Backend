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

@Entity("sessions")
export class Session {

    @PrimaryGeneratedColumn()
    id: number; // Auto-increment integer ID

    @Generated("uuid")
    @Column({ type: "uuid", unique: true })
    uuid: string; // Auto-generated unique UUID

    @Column({ nullable: true })
    user_id?: string;

    @Column({ nullable: true })
    token?: string;

    @Column({ nullable: true })
    device_id?: string;

    @Column({ nullable: true })
    ip_address?: string;

    @Column({ nullable: true })
    device_type?: string;

    @Column({ type: "timestamp", nullable: true })
    expires_at?: Date;

}