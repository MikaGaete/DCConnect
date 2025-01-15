import { Router } from 'express';
import User from './src/routers/User';
import Project from './src/routers/Project';

const router = Router();

/**
 * Main router to handle API endpoints.
 *
 * Routes:
 * - `/users`: Delegates handling to the User router.
 * - `/projects`: Delegates handling to the Project router.
 *
 * @module MainRouter
 * @author
 */
router.use("/users", User);
/**
 * Route `/users` - Handles user-related endpoints.
 * Delegates to the User router.
 */

router.use("/projects", Project);
/**
 * Route `/projects` - Handles project-related endpoints.
 * Delegates to the Project router.
 */

export default router;
