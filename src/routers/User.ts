import { Auth, Create, Hashing, Token } from "../controllers/User";
import { Router } from "express";

const router = Router();

/**
 * Router to handle user-related endpoints.
 *
 * POST "/" - Endpoint for creating a new user. Middleware `Hashing` hashes the user's password before `Create` handles the user creation.
 * POST "/auth" - Endpoint for authenticating a user. Middleware `Token` validates the token before `Auth` processes authentication.
 *
 * @module UserRouter
 * @author Mikael Gaete López
 */
router.post("/", Hashing, Create);
/**
 * POST "/" - Creates a new user.
 * Middleware: Hashing
 * Controller: Create
 */

router.post("/auth", Token, Auth);
/**
 * POST "/auth" - Authenticates a user.
 * Middleware: Token
 * Controller: Auth
 */

export default router;
