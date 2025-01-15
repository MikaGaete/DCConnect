import { Create, GetFeed, GetPersonal, GetSpecific } from "../controllers/Project";
import { Router } from "express";

const router = Router();

/**
 * Router to handle project-related endpoints.
 *
 * POST "/" - Create a new project.
 * GET "/" - Get a feed of projects.
 * GET "/personal" - Get personal projects for the authenticated user.
 * GET "/personal/:id" - Get a specific personal project by its ID.
 *
 * @module ProjectRouter
 */
router.post("/", Create);
/**
 * Handles the creation of a new project.
 * Controller: Create
 */
router.get("/", GetFeed);
/**
 * Retrieves a feed of projects.
 * Controller: GetFeed
 */
router.get("/personal", GetPersonal);
/**
 * Retrieves personal projects for the authenticated user.
 * Controller: GetPersonal
 */
router.get("/personal/:id", GetSpecific);
/**
 * Retrieves a specific personal project by its ID.
 * Controller: GetSpecific
 */

export default router;
