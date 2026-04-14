/*
  Warnings:

  - A unique constraint covering the columns `[no_member]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "memberships_no_member_key" ON "memberships"("no_member");
