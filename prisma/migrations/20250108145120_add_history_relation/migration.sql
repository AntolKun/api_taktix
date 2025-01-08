-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `soal_id` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `answers` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
