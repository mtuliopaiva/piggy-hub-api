-- CreateTable
CREATE TABLE "UserProfile" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "name" TEXT,
    "birthDate" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userUuid_key" ON "UserProfile"("userUuid");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
