/*
  Warnings:

  - The primary key for the `Car` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `car_license` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `manufacture_year` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `model_year` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the `Maintenance_invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Maintenance_register` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `carLicense` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufactureYear` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelYear` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Maintenance_invoice" DROP CONSTRAINT "Maintenance_invoice_maintenance_id_fkey";

-- DropForeignKey
ALTER TABLE "Maintenance_register" DROP CONSTRAINT "Maintenance_register_car_license_fkey";

-- AlterTable
ALTER TABLE "Car" DROP CONSTRAINT "Car_pkey",
DROP COLUMN "car_license",
DROP COLUMN "manufacture_year",
DROP COLUMN "model_year",
DROP COLUMN "user_id",
ADD COLUMN     "carLicense" TEXT NOT NULL,
ADD COLUMN     "manufactureYear" TEXT NOT NULL,
ADD COLUMN     "modelYear" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Car_pkey" PRIMARY KEY ("carLicense");

-- DropTable
DROP TABLE "Maintenance_invoice";

-- DropTable
DROP TABLE "Maintenance_register";

-- CreateTable
CREATE TABLE "MaintenanceRegister" (
    "maintenanceId" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "carKm" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "carLicense" TEXT NOT NULL,

    CONSTRAINT "MaintenanceRegister_pkey" PRIMARY KEY ("maintenanceId")
);

-- CreateTable
CREATE TABLE "MaintenanceInvoice" (
    "maintenanceId" INTEGER NOT NULL,
    "invoice" TEXT NOT NULL,

    CONSTRAINT "MaintenanceInvoice_pkey" PRIMARY KEY ("maintenanceId")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRegister" ADD CONSTRAINT "MaintenanceRegister_carLicense_fkey" FOREIGN KEY ("carLicense") REFERENCES "Car"("carLicense") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceInvoice" ADD CONSTRAINT "MaintenanceInvoice_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "MaintenanceRegister"("maintenanceId") ON DELETE RESTRICT ON UPDATE CASCADE;
