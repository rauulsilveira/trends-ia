/*
  Warnings:

  - Made the column `facebookId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "facebookId", "id", "name", "picture") SELECT "createdAt", "facebookId", "id", "name", "picture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
