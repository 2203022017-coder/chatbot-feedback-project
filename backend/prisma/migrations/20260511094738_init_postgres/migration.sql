-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'Belirtilmemiş',
    "score" DOUBLE PRECISION NOT NULL,
    "needs_human" BOOLEAN NOT NULL DEFAULT false,
    "helpful" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_status" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "analysis_id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "sentiment_label" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "nlp_category" TEXT NOT NULL,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("analysis_id")
);

-- CreateTable
CREATE TABLE "Feedback_Tickets" (
    "ticket_id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "priority_level" TEXT NOT NULL,
    "ticket_status" TEXT NOT NULL DEFAULT 'Açık',
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Feedback_Tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Dashboard_Stats" (
    "stat_id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "total_feedbacks" INTEGER NOT NULL DEFAULT 0,
    "negative_ratio" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "nlp_accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dashboard_Stats_pkey" PRIMARY KEY ("stat_id")
);

-- CreateIndex
CREATE INDEX "Feedback_created_at_idx" ON "Feedback"("created_at");

-- CreateIndex
CREATE INDEX "Feedback_sentiment_idx" ON "Feedback"("sentiment");

-- CreateIndex
CREATE INDEX "Feedback_needs_human_idx" ON "Feedback"("needs_human");

-- CreateIndex
CREATE INDEX "Feedback_brand_idx" ON "Feedback"("brand");

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

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ChatSession"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback_Tickets" ADD CONSTRAINT "Feedback_Tickets_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard_Stats" ADD CONSTRAINT "Dashboard_Stats_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;
