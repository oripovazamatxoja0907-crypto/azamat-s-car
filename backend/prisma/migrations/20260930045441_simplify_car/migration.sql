/*
  Warnings:

  - You are about to drop the column `bodyType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `drivetrain` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engine` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `horsepower` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Car` table. All the data in the column will be lost.
  - Made the column `fuelType` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transmission` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mileage` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "bodyType",
DROP COLUMN "condition",
DROP COLUMN "currency",
DROP COLUMN "drivetrain",
DROP COLUMN "engine",
DROP COLUMN "horsepower",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "fuelType" SET NOT NULL,
ALTER COLUMN "transmission" SET NOT NULL,
ALTER COLUMN "mileage" SET NOT NULL,
ALTER COLUMN "mileage" SET DEFAULT 0,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
