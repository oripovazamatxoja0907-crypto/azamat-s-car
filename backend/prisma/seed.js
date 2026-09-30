require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cars = [
  {
    brand: "Ferrari",
    model: "F40",
    year: 1990,
    price: 2100000,
    category: "Supercar",
    fuelType: "Benzin",
    transmission: "Mexanika",
    color: "Qizil",
    mileage: 12000,
    rating: 5.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-uD17s7AlaNAjAeEQ9VzyibGnzyIK8urMvHhAnegYYQ&s=10",
    description: "Enzo Ferrari nazorat qilgan oxirgi afsonaviy supermashina.",
  },
  {
    brand: "Lamborghini",
    model: "Huracán Evo",
    year: 2023,
    price: 260000,
    category: "Supercar",
    fuelType: "Benzin",
    transmission: "Avtomat",
    color: "Sariq",
    mileage: 3000,
    rating: 4.9,
    imageUrl: "https://dealerimages.dealereprocess.com/image/upload/2425482",
    description: "5.2L V10 dvigatel, to'liq yuritma va yo'l-poyga ruhi.",
  },
  {
    brand: "Porsche",
    model: "911 GT3",
    year: 2023,
    price: 240000,
    category: "Sports",
    fuelType: "Benzin",
    transmission: "Avtomat",
    color: "Kulrang",
    mileage: 5000,
    rating: 4.9,
    imageUrl:
      "https://cdn.prod.website-files.com/655b8b39a148405721d506a6/67f7bdf7ce0154593f8276fe_optimized_67f7b8b0dbcaf.Alexanders-Watermark-layer_SQUARE-New-Logo-28.webp",
    description:
      "Trekka mo'ljallangan, kundalik haydashga ham yaroqli sport avtomobil.",
  },
  {
    brand: "Audi",
    model: "RS7 Performance",
    year: 2023,
    price: 130000,
    category: "Sedan",
    fuelType: "Benzin",
    transmission: "Avtomat",
    color: "Qora",
    mileage: 9000,
    rating: 4.7,
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/audi-rs-7-8-1-668bff50ed6a2.jpg",
    description: "Katta va qulay salon, ammo 621 ot kuchli dvigatel bilan.",
  },
];

async function main() {
  await prisma.car.deleteMany();
  await prisma.car.createMany({ data: cars });
  console.log(`✅ ${cars.length} ta mashina qo'shildi`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
