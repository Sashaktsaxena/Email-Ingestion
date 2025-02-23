-- CreateTable
CREATE TABLE "EmailIngestionConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailIngestionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMetadata" (
    "id" TEXT NOT NULL,
    "emailConfigId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "attachmentFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailIngestionConfig_emailAddress_key" ON "EmailIngestionConfig"("emailAddress");

-- AddForeignKey
ALTER TABLE "EmailMetadata" ADD CONSTRAINT "EmailMetadata_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailIngestionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
