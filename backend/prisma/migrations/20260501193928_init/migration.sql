-- CreateTable
CREATE TABLE "Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "session_status" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ChatSession" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "analysis_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" INTEGER NOT NULL,
    "sentiment_label" TEXT NOT NULL,
    "confidence_score" REAL NOT NULL,
    "nlp_category" TEXT NOT NULL,
    CONSTRAINT "AnalysisResult_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message" ("message_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback_Tickets" (
    "ticket_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" INTEGER NOT NULL,
    "priority_level" TEXT NOT NULL,
    "ticket_status" TEXT NOT NULL DEFAULT 'Açık',
    "resolved_at" DATETIME,
    CONSTRAINT "Feedback_Tickets_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message" ("message_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "Dashboard_Stats" (
    "stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "admin_id" INTEGER NOT NULL,
    "total_feedbacks" INTEGER NOT NULL DEFAULT 0,
    "negative_ratio" REAL NOT NULL DEFAULT 0.0,
    "nlp_accuracy" REAL NOT NULL DEFAULT 0.0,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dashboard_Stats_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin" ("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Feedback_created_at_idx" ON "Feedback"("created_at");

-- CreateIndex
CREATE INDEX "Feedback_sentiment_idx" ON "Feedback"("sentiment");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisResult_message_id_key" ON "AnalysisResult"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_Tickets_message_id_key" ON "Feedback_Tickets"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_Stats_admin_id_key" ON "Dashboard_Stats"("admin_id");
