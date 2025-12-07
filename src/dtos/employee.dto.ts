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
import { EmployeeRole, EmployeeStatus } from "../entities/employee.entity";


export class CreateEmployeeDto {
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
    @IsString({ message: "confirm_password should be string" })
    @MinLength(6, { message: "confirm_password should be at least 6 characters" })
    confirm_password?: string;

    @IsOptional()
    @IsString({ message: "profile_picture should be string" })
    profile_picture?: string;

    @IsOptional()
    @IsEnum(EmployeeRole, { message: "role should be one of: ADMIN, MANAGER, STAFF" })
    role?: EmployeeRole;

    @IsOptional()
    @IsEnum(EmployeeStatus, { message: "status should be one of: ACTIVE, INACTIVE, SUSPENDED, BAN" })
    status?: EmployeeStatus;

}

export class UpdateEmployeeDto {
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
    @IsString({ message: "profile_picture should be string" })
    profile_picture?: string;

    @IsOptional()
    @IsBoolean({ message: "is_active should be boolean" })
    is_active?: boolean;

    @IsOptional()
    @IsEnum(EmployeeRole, { message: "role should be one of: ADMIN, MANAGER, STAFF" })
    role?: EmployeeRole;

    @IsOptional()
    @IsEnum(EmployeeStatus, { message: "status should be one of: ACTIVE, INACTIVE, SUSPENDED, BAN" })
    status?: EmployeeStatus;


    @IsOptional()
    @IsString({ message: "updated_by should be string" })
    updated_by?: string;
}

export interface EmployeeQueryDto {
    page?: number;
    limit?: number;
    status?: EmployeeStatus;
    is_active?: boolean;
    search?: string;
}   