import { Response } from "express";
import { Prisma } from "@prisma/client";
import { JsonWebTokenError } from "jsonwebtoken";
import { z } from "zod";

/**
 * Handles errors by checking their type and sending appropriate HTTP responses.
 *
 * @param {unknown} error - The error object that needs to be handled.
 * @param {Response} res - The Express response object used to send back the HTTP response.
 *
 * - If the error is an instance of `Prisma.PrismaClientKnownRequestError`, it sends a 400 status with the error message.
 * - If the error is an instance of `Prisma.PrismaClientValidationError`, it sends a 400 status with the error message.
 * - If the error is an instance of `JsonWebTokenError`, it sends a 401 status with the error message.
 * - If the error is an instance of `z.ZodError`, it sends a 400 status with the error message.
 * - For all other errors, it sends a 500 status with a generic "Something went wrong" message.
 *
 * @author Mikael Gaete López
 */
export const ThrowError = (error: unknown, res: Response): void => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).send({ status: 400, data: { message: error.message }});
    }
    else if (error instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ status: 400, data: { message: error.message }});
    }
    else if (error instanceof JsonWebTokenError) {
        res.status(401).send({ status: 401, data: { message: error.message }});
    }
    else if (error instanceof z.ZodError) {
        res.status(400).send({ status: 400, data: { message: error.message }});
    }
    else {
        res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
    }
};
