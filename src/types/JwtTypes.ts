import {JwtPayload} from "jsonwebtoken";

/**
 * Interface representing a decoded JWT token payload.
 *
 * @interface DecodedToken
 * @extends {JwtPayload}
 */
export interface DecodedToken extends JwtPayload {
    name: string;
    lastname: string;
    email: string;
}
