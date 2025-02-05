-- CreateTable
CREATE TABLE `Program` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `creator_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `image_banner` VARCHAR(191) NOT NULL,
    `is_enrolled` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status_id` INTEGER NOT NULL,
    `matter_id` INTEGER NOT NULL,
    `with_passing_grade` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
