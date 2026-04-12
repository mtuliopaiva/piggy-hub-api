-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "Transaction" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userUuid" TEXT NOT NULL,
    "categoryUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Category" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "Transaction_userUuid_idx" ON "Transaction"("userUuid");

-- CreateIndex
CREATE INDEX "Transaction_categoryUuid_idx" ON "Transaction"("categoryUuid");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryUuid_fkey" FOREIGN KEY ("categoryUuid") REFERENCES "Category"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
