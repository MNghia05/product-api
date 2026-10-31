const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

function calcDiscountPercent(score) {
  if (score >= 100) return 0.10;
  if (score >= 50) return 0.05;
  return 0;
}

// CREATE order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { items } = req.body; // [{ pid, qty }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least 1 item' });
    }

    const user = await prisma.user.findUnique({
      where: { uid },
      include: { membership: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const discountPercent = calcDiscountPercent(user.membership ? user.membership.score : 0);

    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderDetailsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { pid: item.pid } });
        if (!product) throw new Error(`Product pid=${item.pid} not found`);
        if (product.quantity < item.qty) {
          throw new Error(`Not enough stock for ${product.pname}`);
        }

        await tx.product.update({
          where: { pid: item.pid },
          data: { quantity: { decrement: item.qty } }
        });

        const unitPrice = Number(product.price);
        subtotal += unitPrice * item.qty;

        orderDetailsData.push({
          pid: item.pid,
          qty: item.qty,
          unit_price: unitPrice
        });
      }

      const discount = subtotal * discountPercent;

      const order = await tx.order.create({
        data: {
          uid,
          discount,
          orderDetails: {
            create: orderDetailsData
          },
          shipments: {
            create: { status: 'PENDING' }
          }
        },
        include: { orderDetails: true, shipments: true }
      });

      return { order, subtotal, discount, total: subtotal - discount };
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderDetails: true, shipments: true }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ one order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { oid: parseInt(req.params.id) },
      include: { orderDetails: true, shipments: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
