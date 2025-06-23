-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "car_license" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "manufacture_year" TEXT NOT NULL,
    "model_year" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("car_license")
);

-- CreateTable
CREATE TABLE "Maintenance_register" (
    "maintenance_id" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "car_km" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "car_license" TEXT NOT NULL,

    CONSTRAINT "Maintenance_register_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateTable
CREATE TABLE "Maintenance_invoice" (
    "maintenance_id" INTEGER NOT NULL,
    "invoice" TEXT NOT NULL,

    CONSTRAINT "Maintenance_invoice_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance_register" ADD CONSTRAINT "Maintenance_register_car_license_fkey" FOREIGN KEY ("car_license") REFERENCES "Car"("car_license") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance_invoice" ADD CONSTRAINT "Maintenance_invoice_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "Maintenance_register"("maintenance_id") ON DELETE RESTRICT ON UPDATE CASCADE;
