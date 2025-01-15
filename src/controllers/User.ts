import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { iUser, iUserLogIn, iUserLogInSchema, iUserSchema } from "../interfaces/iUser";
import { sign, verify } from "jsonwebtoken";
import { DecodedToken } from "../types/JwtTypes";
import { ThrowError } from "../utilities/ErrorResponse";

const prisma = new PrismaClient();

/**
 * Middleware to hash the password in the request body before proceeding to the next middleware.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 *
 * @throws {Error} Passes errors to the ThrowError utility if hashing fails.
 *
 * @author Mikael Gaete López
 */
export const Hashing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
            ThrowError(error, res);
        }
        else {
            req.body.password = hash;
            next();
        }
    });
}

/**
 * Creates a new user in the database.
 *
 * @param {Request} req - The Express request object containing user details.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes validation and database errors to the ThrowError utility.
 *
 * @returns {void}
 *
 * @author Mikael Gaete López
 */
export const Create = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: iUser = iUserSchema.parse(req.body);

        await prisma.user.create({
            data: user
        });

        res.status(201).send({ status: 201, data: { message: "User created successfully" } });
    }
    catch (error) {
        ThrowError(error, res);
    }
}

/**
 * Authenticates a user using email and password.
 *
 * @param {Request} req - The Express request object containing login credentials.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes validation and database errors to the ThrowError utility.
 *
 * @returns {void}
 *
 * @author Mikael Gaete López
 */
export const Auth = async (req: Request, res: Response): Promise<void> => {
    try {
        const credentials: iUserLogIn = iUserLogInSchema.parse(req.body);

        const toCompare = await prisma.user.findUnique({
            where: {
                email: credentials.email,
                deleted: false
            },
            select: {
                password: true
            }
        });

        if (!toCompare) {
            res.status(404).send("Account not found");
        }
        else {
            const match = await bcrypt.compare(credentials.password, toCompare.password);

            if (!match) {
                res.status(403).send("Wrong Password");
            }
            else {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                        password: toCompare.password
                    },
                    select: {
                        name: true,
                        lastname: true,
                        email: true
                    }
                });

                if (user !== null && !process.env.JWT_SECRET) {
                    res.status(200).send({ ...user });
                }
                else if (user !== null && process.env.JWT_SECRET) {
                    const token = sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });

                    res.setHeader("Authorization", token).status(200).send({ status: 200, data: { ...user } });
                }
                else {
                    res.status(500).send({ status: 500, data: { message: "Something went wrong" } });
                }
            }
        }
    }
    catch (error) {
        ThrowError(error, res);
    }
}

/**
 * Middleware to validate and refresh a JWT token.
 *
 * @param {Request} req - The Express request object containing the token in the Authorization header.
 * @param {Response} res - The Express response object to send the result.
 * @param {NextFunction} next - The next middleware function.
 *
 * @throws {Error} Passes token-related errors to the ThrowError utility.
 *
 * @returns {void}
 *
 * @author Mikael Gaete López
 */
export const Token = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization');

    if (!token || !process.env.JWT_SECRET) {
        next();
    }
    else {
        try {
            const decoded = verify(token, process.env.JWT_SECRET) as DecodedToken;

            if (!decoded) {
                res.status(401).send("Invalid Token");
            }
            else {
                const { name, lastname, email } = decoded;

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                        deleted: false
                    }
                });

                if (user) {
                    if (name && lastname && email) {
                        const token = sign({ user: { name, lastname, email } }, process.env.JWT_SECRET, { expiresIn: '24h' });

                        res.setHeader("Authorization", token).status(200).send({ status: 200, data: { name, lastname, email } });
                    }
                    else {
                        res.status(500).send({ status: 500, data: { message: "Something went wrong" } });
                    }
                }
                else {
                    res.status(401).send({ status: 401, data: { message: "Token does not correspond to any active account" } });
                }
            }
        }
        catch (error) {
            ThrowError(error, res);
        }
    }
}
