-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `tokenHash` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `Session_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`tokenHash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `key` VARCHAR(191) NOT NULL,
    `failures` INTEGER NOT NULL DEFAULT 0,
    `windowStart` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `blockedUntil` DATETIME(3) NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LandingSection` (
    `key` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentText` (
    `key` VARCHAR(191) NOT NULL,
    `sectionKey` VARCHAR(191) NOT NULL,
    `en` LONGTEXT NOT NULL,
    `ar` LONGTEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentItem` (
    `key` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `sectionKey` VARCHAR(191) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ContentItem_kind_position_idx`(`kind`, `position`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `key` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` LONGTEXT NOT NULL,
    `descriptionAr` LONGTEXT NOT NULL,
    `specialtyEn` LONGTEXT NOT NULL,
    `specialtyAr` LONGTEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `whatsapp` VARCHAR(191) NOT NULL DEFAULT '',
    `crNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `cityKey` VARCHAR(191) NULL,
    `coverageEn` LONGTEXT NOT NULL,
    `coverageAr` LONGTEXT NOT NULL,
    `rating` VARCHAR(191) NOT NULL DEFAULT '',
    `turnaroundEn` VARCHAR(191) NOT NULL DEFAULT '',
    `turnaroundAr` VARCHAR(191) NOT NULL DEFAULT '',
    `projectsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `projectsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `key` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` LONGTEXT NOT NULL,
    `descriptionAr` LONGTEXT NOT NULL,
    `specialtyEn` LONGTEXT NOT NULL,
    `specialtyAr` LONGTEXT NOT NULL,
    `coverageEn` LONGTEXT NOT NULL,
    `coverageAr` LONGTEXT NOT NULL,
    `crNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `rating` VARCHAR(191) NOT NULL DEFAULT '',
    `turnaroundEn` VARCHAR(191) NOT NULL DEFAULT '',
    `turnaroundAr` VARCHAR(191) NOT NULL DEFAULT '',
    `projectsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `projectsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `key` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `icon` VARCHAR(191) NOT NULL DEFAULT '◇',
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `key` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CatalogItem` (
    `key` VARCHAR(191) NOT NULL,
    `supplierKey` VARCHAR(191) NOT NULL,
    `categoryKey` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `unitEn` VARCHAR(191) NOT NULL,
    `unitAr` VARCHAR(191) NOT NULL DEFAULT '',
    `priceHalalas` INTEGER NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeTier` (
    `key` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL,
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` LONGTEXT NOT NULL,
    `descriptionAr` LONGTEXT NOT NULL,
    `minimumHalalas` INTEGER NOT NULL,
    `feeHalalas` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT 'gold',

    UNIQUE INDEX `FeeTier_minimumHalalas_key`(`minimumHalalas`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSetting` (
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Upload` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `supplierKey` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `locator` LONGTEXT NOT NULL,
    `driver` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImportBatch` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `rows` LONGTEXT NOT NULL,
    `errors` LONGTEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'preview',
    `createdCount` INTEGER NOT NULL DEFAULT 0,
    `updatedCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `committedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentText` ADD CONSTRAINT `ContentText_sectionKey_fkey` FOREIGN KEY (`sectionKey`) REFERENCES `LandingSection`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentItem` ADD CONSTRAINT `ContentItem_sectionKey_fkey` FOREIGN KEY (`sectionKey`) REFERENCES `LandingSection`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_cityKey_fkey` FOREIGN KEY (`cityKey`) REFERENCES `City`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogItem` ADD CONSTRAINT `CatalogItem_supplierKey_fkey` FOREIGN KEY (`supplierKey`) REFERENCES `Supplier`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogItem` ADD CONSTRAINT `CatalogItem_categoryKey_fkey` FOREIGN KEY (`categoryKey`) REFERENCES `Category`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upload` ADD CONSTRAINT `Upload_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upload` ADD CONSTRAINT `Upload_supplierKey_fkey` FOREIGN KEY (`supplierKey`) REFERENCES `Supplier`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImportBatch` ADD CONSTRAINT `ImportBatch_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

