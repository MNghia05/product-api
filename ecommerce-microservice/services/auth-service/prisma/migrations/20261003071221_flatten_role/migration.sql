/*
  Warnings:

  - You are about to drop the column `roleid` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_roleid_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "roleid",
ADD COLUMN     "role" VARCHAR(20) NOT NULL DEFAULT 'member';

-- DropTable
DROP TABLE "role";
