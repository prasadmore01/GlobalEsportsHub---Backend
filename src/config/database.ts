import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/user.entity";
import { Tournament } from "../entities/tournament.entity";
import { Employee } from "../entities/employee.entity";
import { EmployeeSession } from "../entities/employeeSession.entity";
import { Session } from "../entities/session.entity";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Tournament, Employee, EmployeeSession, Session],
    synchronize: true,
});
