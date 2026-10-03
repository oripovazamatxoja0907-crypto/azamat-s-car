const { z } = require('zod');

const createCarSchema = z.object({
  brand: z.string().min(2, "Brend kamida 2 ta belgidan iborat bo'lishi kerak"),
  model: z.string().min(1, 'Model nomini kiriting'),
  year: z.coerce
    .number()
    .int()
    .min(1886, "Yil noto'g'ri")
    .max(new Date().getFullYear() + 1, "Yil noto'g'ri"),
  price: z.coerce.number().int().min(0, "Narx manfiy bo'lishi mumkin emas"),
  category: z.string().min(2, 'Kategoriyani kiriting'),
  fuelType: z.string().min(2, "Yoqilg'i turini kiriting"),
  transmission: z.string().min(2, 'Uzatma turini kiriting'),
  color: z.string().min(2, 'Rangni kiriting'),
  mileage: z.coerce.number().int().min(0).default(0),
  rating: z.coerce.number().min(0).max(5).default(0),
  imageUrl: z.string().url("Rasm URL noto'g'ri formatda"),
  description: z.string().optional(),
});

const updateCarSchema = z.object({
  brand: z.string().min(2).optional(),
  model: z.string().min(1).optional(),
  year: z.coerce
    .number()
    .int()
    .min(1886)
    .max(new Date().getFullYear() + 1)
    .optional(),
  price: z.coerce.number().int().min(0).optional(),
  category: z.string().min(2).optional(),
  fuelType: z.string().min(2).optional(),
  transmission: z.string().min(2).optional(),
  color: z.string().min(2).optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  imageUrl: z.string().url("Rasm URL noto'g'ri formatda").optional(),
  description: z.string().optional(),
});

module.exports = { createCarSchema, updateCarSchema };