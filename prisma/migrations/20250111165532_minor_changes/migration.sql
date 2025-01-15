/*
  Warnings:

  - You are about to drop the column `quantity` on the `Position` table. All the data in the column will be lost.
  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `amount` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Position` DROP COLUMN `quantity`,
    ADD COLUMN `amount` TINYINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `deletedAt` DATETIME NULL;
