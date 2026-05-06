-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "needs_human" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Feedback" ("category", "created_at", "id", "score", "sentiment", "text") SELECT "category", "created_at", "id", "score", "sentiment", "text" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE INDEX "Feedback_created_at_idx" ON "Feedback"("created_at");
CREATE INDEX "Feedback_sentiment_idx" ON "Feedback"("sentiment");
CREATE INDEX "Feedback_needs_human_idx" ON "Feedback"("needs_human");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
