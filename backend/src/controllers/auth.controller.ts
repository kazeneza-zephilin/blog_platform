import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // always keep in .env
const JWT_EXPIRES = "1h"; // 1 hour token expiration

// REGISTER
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role, //database alreduy has default value USER
            },
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // sign token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
