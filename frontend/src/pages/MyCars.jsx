import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FALLBACK_IMG = "https://placehold.co/600x400/1a1a1a/666?text=Rasm+yo'q";

const CATEGORIES = ["Sedan", "Supercar", "Hypercar", "Universal", "Sports"];

const FIELDS = [
  { name: "brand", label: "Brend", placeholder: "BMW" },
  { name: "model", label: "Model", placeholder: "M5" },
  { name: "year", label: "Yil", type: "number" },
  { name: "price", label: "Narx ($)", type: "number" },
  { name: "category", label: "Kategoriya", type: "select" },
  { name: "fuelType", label: "Yoqilg'i", placeholder: "Benzin" },
  { name: "transmission", label: "Uzatma", placeholder: "Avtomat" },
  { name: "color", label: "Rang", placeholder: "Qora" },
  { name: "mileage", label: "Yurgan masofa (km)", type: "number" },
  { name: "rating", label: "Reyting (0-5)", type: "number", step: "0.1" },
  {
    name: "imageUrl",
    label: "Rasm havolasi (URL)",
    placeholder: "https://...",
    full: true,
  },
];

const EMPTY_FORM = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  category: "",
  fuelType: "",
  transmission: "",
  color: "",
  mileage: 0,
  rating: 0,
  imageUrl: "",
  description: "",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-steel/30 bg-black/40 px-3 py-2 text-sm text-paper focus:border-red-500 focus:outline-none";

const chipClass = (active) =>
  `rounded-full border px-4 py-1.5 text-sm transition ${
    active
      ? "border-red-500 bg-red-500 text-white"
      : "border-steel/30 text-paper hover:border-red-500/50"
  }`;

// Qidiruv: brend yoki model so'zlaridan biri shu harflar bilan boshlansa mos keladi
function matchesSearch(car, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const fullName = `${car.brand} ${car.model}`.toLowerCase();
  return (
    fullName.startsWith(q) || fullName.split(/\s+/).some((w) => w.startsWith(q))
  );
}

// Backend'ga so'rov yuboradigan yordamchi funksiya (token avtomatik qo'shiladi)
async function request(getToken, path, options = {}) {
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };
  if (options.body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null; // o'chirishda javob bo'sh

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Noma'lum xato");
  return json.data;
}

function CarCard({ car, onEdit, onDelete }) {
  return (
    <div className="group bg-night rounded-2xl border border-steel/20 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10">
      {/* Rasm */}
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs font-medium text-paper">
          {car.category}
        </span>

        <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-sm font-semibold text-paper">
          ⭐ {car.rating.toFixed(1)}
        </span>
      </div>

      {/* Ma'lumot */}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-paper">
            {car.brand} {car.model}
          </h3>
          <span className="text-sm text-steel">{car.year}</span>
        </div>

        {car.description && (
          <p className="mt-2 text-sm text-steel line-clamp-2">
            {car.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-steel">
          <span className="rounded-md bg-steel/10 px-2 py-1">
            ⛽ {car.fuelType}
          </span>
          <span className="rounded-md bg-steel/10 px-2 py-1">
            ⚙️ {car.transmission}
          </span>
          <span className="rounded-md bg-steel/10 px-2 py-1">
            🛣{" "}
            {car.mileage === 0 ? "Yangi" : `${car.mileage.toLocaleString()} km`}
          </span>
          <span className="rounded-md bg-steel/10 px-2 py-1">
            🎨 {car.color}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-steel/20 pt-4">
          <span className="text-xl font-bold text-red-500">
            ${car.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(car)}
              className="whitespace-nowrap rounded-lg border border-steel/30 px-3 py-2 text-sm text-paper transition hover:border-red-500/50"
            >
              ✏️ Tahrirlash
            </button>
            <button
              onClick={() => onDelete(car)}
              className="whitespace-nowrap rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              🗑 O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-night rounded-2xl border border-steel/20 overflow-hidden animate-pulse">
      <div className="aspect-16/10 bg-steel/10" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded bg-steel/10" />
        <div className="h-4 w-full rounded bg-steel/10" />
        <div className="h-4 w-1/2 rounded bg-steel/10" />
      </div>
    </div>
  );
}

// Qo'shish va tahrirlash uchun bitta forma (modal)
function CarForm({ car, saving, error, onSubmit, onClose }) {
  const [values, setValues] = useState(
    car
      ? { ...EMPTY_FORM, ...car, description: car.description ?? "" }
      : EMPTY_FORM,
  );

  // Eski mashinaning kategoriyasi ro'yxatda bo'lmasa ham tanlov yo'qolmasin
  const categoryOptions =
    values.category && !CATEGORIES.includes(values.category)
      ? [values.category, ...CATEGORIES]
      : CATEGORIES;

  function handleChange(e) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Faqat kerakli maydonlarni yuboramiz (id, userId, createdAt ketmaydi)
    const data = {};
    for (const key of Object.keys(EMPTY_FORM)) data[key] = values[key];
    onSubmit(data);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-steel/20 bg-night p-6 shadow-2xl"
      >
        <h2 className="font-display text-2xl font-semibold text-paper mb-5">
          {car ? "Mashinani tahrirlash" : "Yangi mashina qo'shish"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.name} className={f.full ? "sm:col-span-2" : ""}>
              <span className="mb-1 block text-sm text-paper">
                {f.label} <span className="text-red-400">*</span>
              </span>

              {f.type === "select" ? (
                <select
                  name={f.name}
                  value={values[f.name]}
                  onChange={handleChange}
                  required
                  className={INPUT_CLASS}
                >
                  <option value="" disabled>
                    Tanlang...
                  </option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} className="bg-night">
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={f.name}
                  type={f.type || "text"}
                  step={f.step}
                  value={values[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  className={INPUT_CLASS}
                />
              )}
            </label>
          ))}

          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-paper">Tavsif</span>
            <textarea
              name="description"
              rows={3}
              value={values.description}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-steel/30 px-5 py-2 text-sm text-paper transition hover:border-steel/60"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-red-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {saving ? "Saqlanmoqda..." : car ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MyCars() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const savingRef = useRef(false);

  // Qidiruv va filtr
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // READ: mashinalarni olish
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setError("Avval tizimga kiring");
      setLoading(false);
      return;
    }

    async function loadCars() {
      try {
        setError("");
        const data = await request(getToken, "/api/cars");
        setCars(data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.message === "Failed to fetch"
            ? "Serverga ulanib bo'lmadi. Backend ishlayaptimi?"
            : err.message,
        );
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [isLoaded, isSignedIn]);

  function openCreate() {
    setEditingCar(null);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(car) {
    setEditingCar(car);
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (!saving) setFormOpen(false);
  }

  // CREATE va UPDATE
  async function handleSave(values) {
    if (savingRef.current) return; // ikkinchi bosishni to'xtatadi
    savingRef.current = true;
    setSaving(true);
    setFormError("");

    try {
      if (editingCar) {
        const updated = await request(getToken, `/api/cars/${editingCar.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await request(getToken, "/api/cars", {
          method: "POST",
          body: JSON.stringify(values),
        });
        setCars((prev) => [created, ...prev]);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  // DELETE
  async function handleDelete(car) {
    if (!window.confirm(`${car.brand} ${car.model} o'chirilsinmi?`)) return;

    try {
      await request(getToken, `/api/cars/${car.id}`, { method: "DELETE" });
      setCars((prev) => prev.filter((c) => c.id !== car.id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Kategoriyalar va ulardagi mashinalar soni
  const categoryCounts = {};
  for (const c of cars) {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  }
  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Tanlangan kategoriya o'chib ketsa (oxirgi mashina o'chirilsa), "Hammasi"ga qaytadi
  const activeCategory = categoryCounts[category] ? category : "all";

  const searched = cars.filter((c) => matchesSearch(c, search));
  const visibleCars = searched.filter(
    (c) => activeCategory === "all" || c.category === activeCategory,
  );
  const suggestions = search.trim() ? searched.slice(0, 6) : [];
  const isFiltering = search.trim() !== "" || activeCategory !== "all";

  function pickSuggestion(car) {
    setSearch(`${car.brand} ${car.model}`);
    setShowSuggestions(false);
  }

  function clearFilters() {
    setSearch("");
    setCategory("all");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-paper">
            Mening <span className="text-red-500">mashinalarim</span>
          </h1>
          <p className="text-steel mt-1">
            {loading
              ? "Yuklanmoqda..."
              : isFiltering
                ? `${visibleCars.length} / ${cars.length} ta mashina`
                : `Jami ${cars.length} ta mashina`}
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
        >
          + Yangi mashina qo'shish
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Qidiruv va kategoriya filtri */}
      {!loading && cars.length > 0 && (
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="🔍 Mashina qidiring (masalan: A, Fer, RS7...)"
              className="w-full rounded-full border border-steel/30 bg-night px-5 py-3 pr-12 text-sm text-paper placeholder:text-steel focus:border-red-500 focus:outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Tozalash"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-steel transition hover:text-paper"
              >
                ✕
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-steel/20 bg-night shadow-2xl">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-steel/10"
                    >
                      <img
                        src={s.imageUrl}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMG;
                        }}
                        className="h-9 w-14 rounded object-cover"
                      />
                      <span className="flex-1 text-sm text-paper">
                        {s.brand} {s.model}
                      </span>
                      <span className="text-xs text-steel">{s.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={chipClass(activeCategory === "all")}
            >
              Hammasi ({cars.length})
            </button>
            {categories.map(([name, count]) => (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className={chipClass(activeCategory === name)}
              >
                {name} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && cars.length === 0 && (
        <div className="bg-night rounded-2xl border border-steel/20 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-paper mb-2">
            Hozircha hech narsa yo'q
          </h2>
          <p className="text-steel">
            Birinchi mashinani qo'shish uchun tepadagi tugmani bosing.
          </p>
        </div>
      )}

      {!loading && cars.length > 0 && visibleCars.length === 0 && (
        <div className="bg-night rounded-2xl border border-steel/20 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-paper mb-2">
            Hech narsa topilmadi
          </h2>
          <p className="text-steel mb-4">
            Boshqa harf yoki kategoriya bilan urinib ko'ring.
          </p>
          <button
            onClick={clearFilters}
            className="rounded-full border border-steel/30 px-5 py-2 text-sm text-paper transition hover:border-red-500/50"
          >
            Filtrni tozalash
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      {formOpen && (
        <CarForm
          car={editingCar}
          saving={saving}
          error={formError}
          onSubmit={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default MyCars;
