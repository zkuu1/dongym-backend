/*
  Warnings:

  - A unique constraint covering the columns `[id_user,id_product]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "public_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "likes_id_user_id_product_key" ON "likes"("id_user", "id_product");
