import { PrismaClient } from "@prisma/client";

const initialExpertises = [
    { name: "Novice" },
    { name: "Beginner" },
    { name: "Intermediate" },
    { name: "Advanced" },
    { name: "Expert" }
];

const prisma = new PrismaClient();

/**
 * Loads initial expertise data into the database.
 *
 * This function uses Prisma's transaction feature to insert predefined expertise levels
 * into the database in a single operation.
 *
 * @returns {Promise<void>} Resolves when the operation is complete.
 *
 * @throws {Error} If the database operation fails.
 *
 * @author Mikael Gaete López
 */
const LoadTags = async () => {
    await prisma.$transaction([
        prisma.expertise.createMany({
            data: initialExpertises
        })
    ]);
};

LoadTags()
    .then(() => console.log("Expertises inserted successfully"))
    .catch((error) => console.log(error));
