-- AlterTable
ALTER TABLE "absensi" ADD COLUMN     "no_member" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Non Member';

-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "name" SET DEFAULT 'Non Member';
