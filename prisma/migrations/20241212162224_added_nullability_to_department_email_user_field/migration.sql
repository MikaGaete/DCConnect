/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `departmentEmail` VARCHAR(12) NULL,
    MODIFY `deletedAt` DATETIME NULL;
