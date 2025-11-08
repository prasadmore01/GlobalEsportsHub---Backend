import {
    IsString,
    IsEmail,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    MinLength,
    Matches
} from "class-validator";
import { UserStatus } from "../entities/user.entity";

export class CreateUserDto {
    @IsOptional()
    @IsString({ message: "country_code should be string" })
    country_code?: string;

    @IsOptional()
    @IsString({ message: "first_name should be string" })
    first_name?: string;

    @IsOptional()
    @IsString({ message: "last_name should be string" })
    last_name?: string;

    @IsOptional()
    @IsEmail({}, { message: "email should be valid email" })
    email?: string;

    @IsOptional()
    @IsString({ message: "whatsapp_number should be string" })
    whatsapp_number?: string;

    @IsOptional()
    @IsString({ message: "password should be string" })
    @MinLength(6, { message: "password should be at least 6 characters" })
    password?: string;

    @IsOptional()
    @IsString({ message: "upi_id should be string" })
    upi_id?: string;

    @IsOptional()
    @IsString({ message: "profile_picture should be string" })
    profile_picture?: string;

    @IsOptional()
    @IsString({ message: "role should be string" })
    role?: string;

    @IsOptional()
    @IsEnum(UserStatus, { message: "status should be one of: ACTIVE, INACTIVE, SUSPENDED, BAN" })
    status?: UserStatus;

    @IsOptional()
    @IsString({ message: "avatar should be string" })
    avatar?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: "first_name should be string" })
    first_name?: string;

    @IsOptional()
    @IsString({ message: "last_name should be string" })
    last_name?: string;

    @IsOptional()
    @IsEmail({}, { message: "email should be valid email" })
    email?: string;

    @IsOptional()
    @IsString({ message: "whatsapp_number should be string" })
    whatsapp_number?: string;

    @IsOptional()
    @IsString({ message: "password should be string" })
    @MinLength(6, { message: "password should be at least 6 characters" })
    password?: string;

    @IsOptional()
    @IsString({ message: "upi_id should be string" })
    upi_id?: string;

    @IsOptional()
    @IsString({ message: "profile_picture should be string" })
    profile_picture?: string;

    @IsOptional()
    @IsBoolean({ message: "is_active should be boolean" })
    is_active?: boolean;

    @IsOptional()
    @IsString({ message: "role should be string" })
    role?: string;

    @IsOptional()
    @IsEnum(UserStatus, { message: "status should be one of: ACTIVE, INACTIVE, SUSPENDED, BAN" })
    status?: UserStatus;

    @IsOptional()
    @IsString({ message: "avatar should be string" })
    avatar?: string;

    @IsOptional()
    @IsString({ message: "updated_by should be string" })
    updated_by?: string;
}

export interface UserQueryDto {
    page?: number;
    limit?: number;
    status?: UserStatus;
    is_active?: boolean;
    search?: string;
}