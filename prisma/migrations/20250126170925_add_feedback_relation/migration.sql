-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soal_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
