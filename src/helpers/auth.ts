import jwt from "jsonwebtoken";

export class AuthHelper {
    static async generateToken(id: number, email: string, mobile_number: string, role: string): Promise<string> {
        return jwt.sign({ id, email, mobile_number, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    }

    static async verifyToken(token: string): Promise<any> {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    static async decodeToken(token: string): Promise<any> {
        return jwt.decode(token);
    }
}