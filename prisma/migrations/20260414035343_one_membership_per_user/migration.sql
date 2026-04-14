/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "memberships_id_user_key" ON "memberships"("id_user");
