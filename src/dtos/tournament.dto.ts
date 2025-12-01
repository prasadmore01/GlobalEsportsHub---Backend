import {
    IsString,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsJSON,
    IsNotEmpty
} from "class-validator";
import { UserStatus } from "../entities/user.entity";
import { TournamentStatus } from "../entities/tournament.entity";

export class CreateTournamentDto {
    @IsNotEmpty()
    @IsString({ message: "title should be string" })
    title?: string;

    @IsOptional()
    @IsString({ message: "tagline should be string" })
    tagline?: string;

    @IsOptional()
    @IsString({ message: "description should be string" })
    description?: string;

    @IsOptional()
    @IsString({ message: "type should be string" })
    type?: string;

    @IsOptional()
    @IsString({ message: "entry_fee should be string" })
    entry_fee?: string;

    @IsOptional()
    @IsString({ message: "prizepool should be string" })
    prizepool?: string;

    @IsOptional()
    @IsString({ message: "first_prize should be string" })
    first_prize?: string;

    @IsOptional()
    @IsString({ message: "second_prize should be string" })
    second_prize?: string;

    @IsOptional()
    @IsString({ message: "third_prize should be string" })
    third_prize?: string;

    @IsOptional()
    @IsNumber({}, { message: "max_participants should be number" })
    max_participants?: number;

    @IsOptional()
    @IsNumber({}, { message: "min_participants should be number" })
    min_participants?: number;

    @IsOptional()
    @IsNumber({}, { message: "max_teams should be number" })
    max_teams?: number;

    @IsOptional()
    @IsNumber({}, { message: "min_teams should be number" })
    min_teams?: number;

    @IsOptional()
    @IsString({ message: "tournament_start_date should be string" })
    tournament_start_date?: string;

    @IsOptional()
    @IsString({ message: "tournament_end_date should be string" })
    tournament_end_date?: string;

    @IsOptional()
    @IsString({ message: "registration_start_date should be string" })
    registration_start_date?: string;

    @IsOptional()
    @IsBoolean({ message: "is_active should be boolean" })
    is_active?: boolean;

    @IsOptional()
    @IsString({ message: "registration_end_date should be string" })
    registration_end_date?: string;

    @IsOptional()
    rules?: any;


    @IsOptional()
    @IsEnum(TournamentStatus, { message: "status should be one of: UPCOMING, LIVE, CLOSED, REMOVED" })
    status?: TournamentStatus;

    @IsOptional()
    @IsString({ message: "updated_by should be string" })
    updated_by?: string;
}


export class UpdateTournamentDto extends CreateTournamentDto {
    @IsOptional()
    @IsString({ message: "updated_by should be string" })
    updated_by?: string;
}
