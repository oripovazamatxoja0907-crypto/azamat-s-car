-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" TEXT NOT NULL,
    "engine" TEXT,
    "fuelType" TEXT,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "horsepower" INTEGER,
    "mileage" INTEGER,
    "color" TEXT,
    "bodyType" TEXT,
    "imageUrl" TEXT,
    "condition" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
