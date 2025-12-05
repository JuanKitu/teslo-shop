-- CreateTable
CREATE TABLE "global_variant_values" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,
    "colorHex" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_variant_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "global_variant_values_optionId_idx" ON "global_variant_values"("optionId");

-- CreateIndex
CREATE INDEX "global_variant_values_order_idx" ON "global_variant_values"("order");

-- CreateIndex
CREATE INDEX "global_variant_values_isActive_idx" ON "global_variant_values"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "global_variant_values_optionId_value_key" ON "global_variant_values"("optionId", "value");

-- AddForeignKey
ALTER TABLE "global_variant_values" ADD CONSTRAINT "global_variant_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
