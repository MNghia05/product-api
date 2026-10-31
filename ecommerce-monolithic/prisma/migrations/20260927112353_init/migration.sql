-- CreateTable
CREATE TABLE "role" (
    "roleid" SERIAL NOT NULL,
    "rolename" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "membership" (
    "mid" SERIAL NOT NULL,
    "mname" VARCHAR(50) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "membership_pkey" PRIMARY KEY ("mid")
);

-- CreateTable
CREATE TABLE "user" (
    "uid" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roleid" INTEGER NOT NULL,
    "mid" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "product" (
    "pid" SERIAL NOT NULL,
    "pname" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "order" (
    "oid" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "orderdetail" (
    "oid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "orderdetail_pkey" PRIMARY KEY ("oid","pid")
);

-- CreateTable
CREATE TABLE "shipment" (
    "shipid" SERIAL NOT NULL,
    "oid" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("shipid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_mid_fkey" FOREIGN KEY ("mid") REFERENCES "membership"("mid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_uid_fkey" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderdetail" ADD CONSTRAINT "orderdetail_oid_fkey" FOREIGN KEY ("oid") REFERENCES "order"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderdetail" ADD CONSTRAINT "orderdetail_pid_fkey" FOREIGN KEY ("pid") REFERENCES "product"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_oid_fkey" FOREIGN KEY ("oid") REFERENCES "order"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;
