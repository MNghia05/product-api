-- CreateTable
CREATE TABLE "role" (
    "roleid" SERIAL NOT NULL,
    "rolename" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "user" (
    "uid" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roleid" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_rolename_key" ON "role"("rolename");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;
