import routes from "./router";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

/**
 * Checks for the presence of the `PORT` environment variable.
 * Logs a message if the `PORT` is not specified.
 */
if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const port = parseInt(process.env.PORT as string, 10);
const app = express();

/**
 * Middleware configurations:
 * - `express.json()` - Parses incoming JSON requests.
 * - `express.urlencoded({ extended: true })` - Parses URL-encoded requests.
 * - `cors()` - Enables Cross-Origin Resource Sharing.
 * - Routes are mounted under `/api/v2`.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v2", routes);

/**
 * Starts the server and listens on the specified port.
 *
 * @param {number} port - The port number to listen on.
 * Logs a message when the server starts successfully.
 */
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
