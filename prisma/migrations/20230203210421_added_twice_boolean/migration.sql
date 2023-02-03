/*
  Warnings:

  - Added the required column `twice` to the `DryerNumber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twice` to the `LaundryNumber` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DryerNumber" ADD COLUMN     "twice" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "LaundryNumber" ADD COLUMN     "twice" BOOLEAN NOT NULL;
