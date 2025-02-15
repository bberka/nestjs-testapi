/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newPasswordHash` to the `PasswordChangeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPasswordHash` to the `PasswordChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordChangeLog" ADD COLUMN     "newPasswordHash" TEXT NOT NULL,
ADD COLUMN     "oldPasswordHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
