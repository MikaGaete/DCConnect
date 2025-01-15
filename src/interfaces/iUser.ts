import { z } from "zod";

/**
 * Interface representing a user.
 *
 * @property {string} name - The first name of the user.
 * @property {string} lastname - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} [departmentEmail] - Optional department-specific email address of the user.
 */
export interface iUser {
    name: string;
    lastname: string;
    email: string;
    password: string;
    departmentEmail?: string;
}

/**
 * Interface representing user login credentials.
 *
 * @property {string} email - The email address used to log in.
 * @property {string} password - The password associated with the email.
 */
export interface iUserLogIn {
    email: string;
    password: string;
}

/**
 * Zod schema for validating the iUser object.
 *
 * @property {string} [id] - Optional unique identifier of the user.
 * @property {string} name - The first name of the user.
 * @property {string} lastname - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user, minimum length 60 characters.
 * @property {string} [departmentEmail] - Optional department-specific email address.
 */
export const iUserSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string().min(60),
    departmentEmail: z.string().email().optional(),
});

/**
 * Zod schema for validating the iUserLogIn object.
 *
 * @property {string} email - The email address used to log in.
 * @property {string} password - The password associated with the email.
 */
export const iUserLogInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

/**
 * @author Mikael Gaete López
 */
