const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const placeOrder = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item' });
  }

  for (const [index, item] of items.entries()) {
    if (
      !item.bookId ||
      typeof item.bookId !== 'number' ||
      !item.quantity ||
      typeof item.quantity !== 'number'
    ) {
      return res.status(400).json({
        message: `Invalid item at index ${index}: bookId and quantity are required and must be numbers`,
      });
    }
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        items: {
          create: items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: true } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders };
