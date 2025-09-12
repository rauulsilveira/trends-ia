-- CreateTable
CREATE TABLE "Trend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT,
    "thumbnail" TEXT,
    "tags" TEXT NOT NULL
);
