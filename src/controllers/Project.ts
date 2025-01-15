import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { iProject, iProjectSchema } from "../interfaces/iProject";
import { verify } from "jsonwebtoken";
import { DecodedToken } from "../types/JwtTypes";
import { ThrowError } from "../utilities/ErrorResponse";

const prisma = new PrismaClient();

/**
 * Creates a new project in the database.
 *
 * @param {Request} req - The Express request object containing the project data and authorization token.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes errors to the ThrowError utility.
 *
 * @author Mikael Gaete López
 */
export const Create = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization');

        if (!token || !process.env.JWT_SECRET) {
            res.status(401).send({ status: 401, data: { message: "Token not found" }});
        }
        else {
            const { email } = verify(token, process.env.JWT_SECRET) as DecodedToken;
            const project: iProject = iProjectSchema.parse(req.body);

            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true
                }
            });

            if (user !== null) {
                const { id } = await prisma.project.create({
                    data: {
                        name: project.name,
                        description: project.description,
                        abstract: project.abstract,
                        userId: user.id
                    },
                    select: {
                        id: true
                    }
                });

                if (id) {
                    for (let i = 0; i < project.technologies.length; i++) {
                        project.technologies[i].projectId = id;
                        project.tags[i].projectId = id; // If nothing magical happens tags and technologies should have the same length.
                    }
                    for (let i = 0; i < project.positions.length; i++) {
                        project.positions[i].projectId = id;
                    }

                    await prisma.$transaction([
                        prisma.projectTag.createMany({
                            // @ts-expect-error Takes project.tags as string | undefined but in practice is always a string.
                            data: project.tags
                        }),
                        prisma.technology.createMany({
                            // @ts-expect-error Takes project.tags as string | undefined but in practice is always a string.
                            data: project.technologies
                        }),
                        prisma.position.createMany({
                            // @ts-expect-error Takes project.tags as string | undefined but in practice is always a string.
                            data: project.positions
                        })
                    ]);

                    res.status(201).send({ status: 201, data: { message: "Project created successfully" }});
                }
                else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
            }
            else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
        }
    }
    catch (error) {
        ThrowError(error, res);
    }
}

/**
 * Fetches a feed of projects based on user interests.
 *
 * @param {Request} req - The Express request object containing the authorization token.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes errors to the ThrowError utility.
 *
 * @author Mikael Gaete López
 */
export const GetFeed = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization');

        if (!token || !process.env.JWT_SECRET) {
            res.status(401).send({ status: 401, data: { message: "Token not found" }});
        }
        else {
            const { email } = verify(token, process.env.JWT_SECRET) as DecodedToken;

            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    Interests: {
                        select: {
                            tagId: true
                        }
                    }
                }
            });

            if (user?.id) {
                const projects = await prisma.project.findMany({
                    where: {
                        userId: {
                            not: user.id
                        },
                        ProjectTags: user.Interests && {
                            some: {
                                OR: user.Interests
                            }
                        },
                        deleted: false
                    },
                    select: {
                        id: true,
                        name: true,
                        abstract: true,
                        description: true,
                        ProjectTags: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        Positions: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                amount: true
                            }
                        },
                        Technologies: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                },
                                Expertise: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: [{
                        createdAt: 'desc'
                    }]
                });

                if (projects) {
                    res.status(200).send({ status: 200, data: { projects, message: "Projects fetched successfully" }});
                }
                else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
            }
            else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
        }
    }
    catch (error) {
        ThrowError(error, res);
    }
}

/**
 * Fetches personal projects for the authenticated user.
 *
 * @param {Request} req - The Express request object containing the authorization token.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes errors to the ThrowError utility.
 *
 * @author Mikael Gaete López
 */
export const GetPersonal = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization');

        if (!token || !process.env.JWT_SECRET) {
            res.status(401).send({ status: 401, data: { message: "Token not found" }});
        }
        else {
            const { email } = verify(token, process.env.JWT_SECRET) as DecodedToken;

            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true
                }
            });

            if (user?.id) {
                const projects = await prisma.project.findMany({
                    where: {
                        userId: user.id
                    },
                    select: {
                        id: true,
                        name: true,
                        abstract: true,
                        description: true,
                        ProjectTags: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        Positions: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                amount: true
                            }
                        },
                        Technologies: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                },
                                Expertise: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: [{
                        createdAt: 'desc'
                    }]
                });

                if (projects) {
                    res.status(200).send({ status: 200, data: { projects, message: "Projects fetched successfully" }});
                }
                else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
            }
            else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
        }
    }
    catch (error) {
        ThrowError(error, res);
    }
}

/**
 * Fetches a specific personal project for the authenticated user.
 *
 * @param {Request} req - The Express request object containing the project ID and authorization token.
 * @param {Response} res - The Express response object to send the result.
 *
 * @throws {Error} Passes errors to the ThrowError utility.
 *
 * @author Mikael Gaete López
 */
export const GetSpecific = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization');
        const { id } = req.params;

        if (!token || !process.env.JWT_SECRET) {
            res.status(401).send({ status: 401, data: { message: "Token not found" }});
        }
        else if (!id) {
            res.status(401).send({ status: 400, data: { message: "Project id not provided" }});
        }
        else {
            const { email } = verify(token, process.env.JWT_SECRET) as DecodedToken;

            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true
                }
            });

            if (user?.id) {
                const project = await prisma.project.findUnique({
                    where: {
                        id,
                        userId: user.id
                    },
                    select: {
                        id: true,
                        name: true,
                        abstract: true,
                        description: true,
                        ProjectTags: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        Positions: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                amount: true
                            }
                        },
                        Technologies: {
                            select: {
                                Tag: {
                                    select: {
                                        name: true
                                    }
                                },
                                Expertise: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (project) {
                    res.status(200).send({ status: 200, data: { project, message: "Project fetched successfully" }});
                }
                else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
            }
            else res.status(500).send({ status: 500, data: { message: "Something went wrong" }});
        }
    }
    catch (error) {
        ThrowError(error, res);
    }
}
