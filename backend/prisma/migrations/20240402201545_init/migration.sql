/*
  Warnings:

  - Added the required column `Balance` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "Balance" INTEGER NOT NULL;
