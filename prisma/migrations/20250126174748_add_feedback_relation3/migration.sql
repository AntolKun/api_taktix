/*
  Warnings:

  - You are about to drop the column `created_at` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `feedback` table. All the data in the column will be lost.
  - Made the column `feedback` on table `feedback` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `created_at`,
    DROP COLUMN `user_id`,
    MODIFY `feedback` VARCHAR(191) NOT NULL;
