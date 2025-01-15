import { z } from "zod";

/**
 * Interface representing a position in a project.
 *
 * @property {string} id - Unique identifier for the position.
 * @property {string} name - Name of the position.
 * @property {string} description - Description of the position.
 * @property {number} amount - Number of positions available.
 * @property {string} [projectId] - Optional project ID associated with the position.
 */
export interface iPosition {
    id: string;
    name: string;
    description: string;
    amount: number;
    projectId?: string;
}

/**
 * Interface representing a project tag.
 *
 * @property {number} tagId - Unique identifier for the tag.
 * @property {string} [projectId] - Optional project ID associated with the tag.
 */
export interface iProjectTag {
    tagId: number;
    projectId?: string;
}

/**
 * Interface representing a technology used in a project.
 *
 * @property {number} tagId - Unique identifier for the technology tag.
 * @property {number} expertiseId - Unique identifier for the expertise level.
 * @property {string} [projectId] - Optional project ID associated with the technology.
 */
export interface iTechnology {
    tagId: number;
    expertiseId: number;
    projectId?: string;
}

/**
 * Interface representing a project.
 *
 * @property {string} userId - Unique identifier of the user who created the project.
 * @property {string} name - Name of the project.
 * @property {string} abstract - Brief summary of the project.
 * @property {string} description - Detailed description of the project.
 * @property {iProjectTag[]} tags - Array of tags associated with the project.
 * @property {iTechnology[]} technologies - Array of technologies used in the project.
 * @property {iPosition[]} positions - Array of positions available in the project.
 */
export interface iProject {
    userId: string;
    name: string;
    abstract: string;
    description: string;
    tags: iProjectTag[];
    technologies: iTechnology[];
    positions: iPosition[];
}

/**
 * Zod schema for validating an iPosition object.
 *
 * @property {string} id - Must be a string with a length of 36 characters.
 * @property {string} name - Must be a string.
 * @property {string} description - Must be a string.
 * @property {number} amount - Must be a positive number.
 * @property {string} [projectId] - Optional string with a length of 36 characters.
 */
export const iPositionSchema = z.object({
    id: z.string().length(36),
    name: z.string(),
    description: z.string(),
    amount: z.number().positive(),
    projectId: z.string().length(36).optional()
});

/**
 * Zod schema for validating an iProjectTag object.
 *
 * @property {number} tagId - Must be a positive number.
 * @property {string} [projectId] - Optional string with a length of 36 characters.
 */
export const iProjectTagsSchema = z.object({
    tagId: z.number().positive(),
    projectId: z.string().length(36).optional()
});

/**
 * Zod schema for validating an iTechnology object.
 *
 * @property {number} tagId - Must be a positive number.
 * @property {number} expertiseId - Must be a positive number.
 * @property {string} [projectId] - Optional string with a length of 36 characters.
 */
export const iTechnologySchema = z.object({
    tagId: z.number().positive(),
    expertiseId: z.number().positive(),
    projectId: z.string().length(36).optional()
});

/**
 * Zod schema for validating an iProject object.
 *
 * @property {string} userId - Must be a string with a length of 36 characters.
 * @property {string} name - Must be a string.
 * @property {string} abstract - Must be a string.
 * @property {string} description - Must be a string.
 * @property {iProjectTag[]} tags - Must be an array of iProjectTag objects.
 * @property {iTechnology[]} technologies - Must be an array of iTechnology objects.
 * @property {iPosition[]} positions - Must be an array of iPosition objects.
 */
export const iProjectSchema = z.object({
    userId: z.string().length(36),
    name: z.string(),
    abstract: z.string(),
    description: z.string(),
    tags: z.array(iProjectTagsSchema),
    technologies: z.array(iTechnologySchema),
    positions: z.array(iPositionSchema)
});

/**
 * @author Mikael Gaete López
 */
