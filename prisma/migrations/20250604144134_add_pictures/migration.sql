-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "sourceName" TEXT NOT NULL,
    "pictures" TEXT NOT NULL DEFAULT '''[]''',
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "description", "id", "name", "price", "sourceName") SELECT "categoryId", "description", "id", "name", "price", "sourceName" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "pictures" TEXT NOT NULL DEFAULT '''[]'''
);
INSERT INTO "new_ProductVariant" ("id", "name", "price", "productId", "sourceName", "value") SELECT "id", "name", "price", "productId", "sourceName", "value" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
