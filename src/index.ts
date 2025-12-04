import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./swagger/swagger.config";
import userRoutes from "./routes/user.routes";
import tournamentRoutes from "./routes/tournament.routes";
import { ExceptionFilter } from "./exceptions/ExceptionFilter";
import employeeRoutes from "./routes/employee.routes";

dotenv.config();


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/employees", employeeRoutes);

// 404 Handler - Must be after all routes
app.use(ExceptionFilter.notFoundHandler);

// Global Error Handler - Must be last
app.use(ExceptionFilter.handle);

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected!");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
            console.log(`🏥 Health check at http://localhost:${PORT}/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
    // In production, you might want to:
    // - Log to error tracking service (Sentry, etc.)
    // - Gracefully shutdown the server
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
    console.error("❌ Uncaught Exception:", error);
    // In production, you should gracefully shutdown
    process.exit(1);
});
