-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "Car"("userId");
