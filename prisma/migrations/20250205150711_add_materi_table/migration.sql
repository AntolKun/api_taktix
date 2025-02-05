-- CreateTable
CREATE TABLE `Materi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `youtubeLink` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Materi` ADD CONSTRAINT `Materi_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
