-- CreateTable
CREATE TABLE "LaundryList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaundryList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaundryNumber" (
    "id" SERIAL NOT NULL,
    "laundryListId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "LaundryNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LaundryNumber" ADD CONSTRAINT "LaundryNumber_laundryListId_fkey" FOREIGN KEY ("laundryListId") REFERENCES "LaundryList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
