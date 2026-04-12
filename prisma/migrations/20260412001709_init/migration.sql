-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Role" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Permission" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userUuid" TEXT NOT NULL,
    "roleUuid" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userUuid","roleUuid")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleUuid" TEXT NOT NULL,
    "permissionUuid" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleUuid","permissionUuid")
);

-- CreateTable
CREATE TABLE "Audit" (
    "uuid" TEXT NOT NULL,
    "actorUuid" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityUuid" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "uuid" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "stack" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "UserRole_roleUuid_idx" ON "UserRole"("roleUuid");

-- CreateIndex
CREATE INDEX "RolePermission_permissionUuid_idx" ON "RolePermission"("permissionUuid");

-- CreateIndex
CREATE INDEX "Audit_actorUuid_idx" ON "Audit"("actorUuid");

-- CreateIndex
CREATE INDEX "Audit_entity_idx" ON "Audit"("entity");

-- CreateIndex
CREATE INDEX "Audit_entityUuid_idx" ON "Audit"("entityUuid");

-- CreateIndex
CREATE INDEX "Audit_createdAt_idx" ON "Audit"("createdAt");

-- CreateIndex
CREATE INDEX "EventLog_level_idx" ON "EventLog"("level");

-- CreateIndex
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleUuid_fkey" FOREIGN KEY ("roleUuid") REFERENCES "Role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleUuid_fkey" FOREIGN KEY ("roleUuid") REFERENCES "Role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionUuid_fkey" FOREIGN KEY ("permissionUuid") REFERENCES "Permission"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
