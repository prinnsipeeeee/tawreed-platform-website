-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Session" (
    "tokenHash" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "windowStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedUntil" DATETIME
);

-- CreateTable
CREATE TABLE "LandingSection" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ContentText" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "sectionKey" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "ar" TEXT NOT NULL,
    CONSTRAINT "ContentText_sectionKey_fkey" FOREIGN KEY ("sectionKey") REFERENCES "LandingSection" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ContentItem_sectionKey_fkey" FOREIGN KEY ("sectionKey") REFERENCES "LandingSection" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "specialtyEn" TEXT NOT NULL,
    "specialtyAr" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "crNumber" TEXT NOT NULL DEFAULT '',
    "cityKey" TEXT,
    "coverageEn" TEXT NOT NULL,
    "coverageAr" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT '',
    "turnaroundEn" TEXT NOT NULL DEFAULT '',
    "turnaroundAr" TEXT NOT NULL DEFAULT '',
    "projectsEn" TEXT NOT NULL DEFAULT '',
    "projectsAr" TEXT NOT NULL DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Supplier_cityKey_fkey" FOREIGN KEY ("cityKey") REFERENCES "City" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "specialtyEn" TEXT NOT NULL,
    "specialtyAr" TEXT NOT NULL,
    "coverageEn" TEXT NOT NULL,
    "coverageAr" TEXT NOT NULL,
    "crNumber" TEXT NOT NULL DEFAULT '',
    "rating" TEXT NOT NULL DEFAULT '',
    "turnaroundEn" TEXT NOT NULL DEFAULT '',
    "turnaroundAr" TEXT NOT NULL DEFAULT '',
    "projectsEn" TEXT NOT NULL DEFAULT '',
    "projectsAr" TEXT NOT NULL DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Category" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '◇',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "City" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CatalogItem" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "supplierKey" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "unitEn" TEXT NOT NULL,
    "unitAr" TEXT NOT NULL DEFAULT '',
    "priceHalalas" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CatalogItem_supplierKey_fkey" FOREIGN KEY ("supplierKey") REFERENCES "Supplier" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CatalogItem_categoryKey_fkey" FOREIGN KEY ("categoryKey") REFERENCES "Category" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeeTier" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "minimumHalalas" INTEGER NOT NULL,
    "feeHalalas" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'gold'
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "supplierKey" TEXT,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "locator" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Upload_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Upload_supplierKey_fkey" FOREIGN KEY ("supplierKey") REFERENCES "Supplier" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "rows" TEXT NOT NULL,
    "errors" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'preview',
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "committedAt" DATETIME,
    CONSTRAINT "ImportBatch_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "ContentItem_kind_position_idx" ON "ContentItem"("kind", "position");

-- CreateIndex
CREATE UNIQUE INDEX "FeeTier_minimumHalalas_key" ON "FeeTier"("minimumHalalas");

