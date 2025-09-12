-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT,
    "thumbnail" TEXT,
    "tags" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'google',
    "trendDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Trend" ("id", "summary", "tags", "thumbnail", "title", "url") SELECT "id", "summary", "tags", "thumbnail", "title", "url" FROM "Trend";
DROP TABLE "Trend";
ALTER TABLE "new_Trend" RENAME TO "Trend";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
