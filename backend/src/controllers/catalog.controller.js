const prisma = require("../prisma");

const getCatalog = async (req, res, next) => {
  try {
    const items = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      // userId ni ataylab olmaymiz: boshqalarning Clerk ID'si tashqariga chiqmasin
      select: {
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
      },
    });

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCatalog };
