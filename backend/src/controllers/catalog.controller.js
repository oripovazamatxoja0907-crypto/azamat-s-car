const prisma = require("../prisma");

// userId ni ataylab olmaymiz: boshqalarning Clerk ID'si tashqariga chiqmasin
const PUBLIC_FIELDS = {
  id: true,
  brand: true,
  model: true,
  year: true,
  price: true,
  category: true,
  fuelType: true,
  transmission: true,
  color: true,
  mileage: true,
  rating: true,
  imageUrl: true,
  description: true,
  createdAt: true,
};

const getCatalog = async (req, res, next) => {
  try {
    const items = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      select: PUBLIC_FIELDS,
    });

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getCatalogById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Noto'g'ri id" });
    }

    const item = await prisma.car.findUnique({
      where: { id },
      select: PUBLIC_FIELDS,
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

module.exports = { getCatalog, getCatalogById };
