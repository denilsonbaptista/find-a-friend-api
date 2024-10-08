/*
  Warnings:

  - You are about to drop the `photo` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `age` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `environment` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Age" AS ENUM ('Puppy', 'Adult', 'Old');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('Small', 'Medium', 'Large');

-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_pet_id_fkey";

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "age",
ADD COLUMN     "age" "Age" NOT NULL,
DROP COLUMN "environment",
ADD COLUMN     "environment" "Environment" NOT NULL;

-- DropTable
DROP TABLE "photo";
