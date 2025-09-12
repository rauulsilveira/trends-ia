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
    "source" TEXT NOT NULL,
    "trendDate" DATETIME NOT NULL,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "rewriteRequested" BOOLEAN NOT NULL DEFAULT false,
    "contentGenerated" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailGenerated" BOOLEAN NOT NULL DEFAULT false,
    "visibleToAdmin" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME
);
INSERT INTO "new_Trend" ("approved", "createdAt", "id", "processedAt", "rejected", "rewriteRequested", "source", "summary", "tags", "thumbnail", "title", "trendDate", "url") SELECT "approved", "createdAt", "id", "processedAt", "rejected", "rewriteRequested", "source", "summary", "tags", "thumbnail", "title", "trendDate", "url" FROM "Trend";
DROP TABLE "Trend";
ALTER TABLE "new_Trend" RENAME TO "Trend";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
