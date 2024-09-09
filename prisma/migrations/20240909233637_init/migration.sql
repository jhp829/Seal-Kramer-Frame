-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "yes" INTEGER NOT NULL DEFAULT 0,
    "no" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votes" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Votes_roundId_userId_key" ON "Votes"("roundId", "userId");

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
