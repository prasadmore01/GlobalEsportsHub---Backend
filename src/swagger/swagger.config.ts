import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

export const swaggerOptions = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation"
        },
        servers: [
            {
                url: `${process.env.BASE_URL || "http://localhost:9000"}`,
                description: "Local Server"
            }
        ]
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/entities/*.ts"], // where swagger reads documentation
});
