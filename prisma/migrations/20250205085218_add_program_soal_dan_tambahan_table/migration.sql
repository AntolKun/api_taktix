-- CreateTable
CREATE TABLE `ProgramSoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `program_id` VARCHAR(191) NOT NULL,
    `grade_id` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `total_question` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `is_free` BOOLEAN NOT NULL,
    `is_public` BOOLEAN NOT NULL,
    `rating` DOUBLE NOT NULL,
    `banner_image` VARCHAR(191) NULL,
    `creator_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soal_id` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `correct` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramUserAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `soal_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `chosen` VARCHAR(191) NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `soal_id` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `answers` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramFeedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NOT NULL,
    `soal_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProgramSoal` ADD CONSTRAINT `ProgramSoal_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `Program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramQuestion` ADD CONSTRAINT `ProgramQuestion_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `ProgramSoal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramOption` ADD CONSTRAINT `ProgramOption_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `ProgramQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramUserAnswer` ADD CONSTRAINT `ProgramUserAnswer_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `ProgramSoal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramUserAnswer` ADD CONSTRAINT `ProgramUserAnswer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `ProgramQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramHistory` ADD CONSTRAINT `ProgramHistory_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `ProgramSoal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramFeedback` ADD CONSTRAINT `ProgramFeedback_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `ProgramSoal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
