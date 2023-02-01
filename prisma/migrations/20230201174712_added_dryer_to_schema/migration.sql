-- CreateTable
CREATE TABLE "DryerList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DryerList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DryerNumber" (
    "id" SERIAL NOT NULL,
    "dryerListId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "DryerNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DryerNumber" ADD CONSTRAINT "DryerNumber_dryerListId_fkey" FOREIGN KEY ("dryerListId") REFERENCES "DryerList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
