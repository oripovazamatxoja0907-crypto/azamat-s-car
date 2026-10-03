const prisma = require("../prisma");

const getAll = async (req, res, next) => {
  try {
    const items = await prisma.car.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid id" });
    }

    const item = await prisma.car.findFirst({
      where: { id, userId: req.userId },
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Mashina topilmadi" });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await prisma.car.create({
      data: {
        ...req.body,
        userId: req.userId,
      },
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid id" });
    }

    const existing = await prisma.car.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, error: "Mashina topilmadi" });
    }

    const item = await prisma.car.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid id" });
    }

    const existing = await prisma.car.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, error: "Mashina topilmadi" });
    }

    await prisma.car.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
