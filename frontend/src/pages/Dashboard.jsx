import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FALLBACK_IMG = "https://placehold.co/600x400/1a1a1a/666?text=Rasm+yo'q";

const chipClass = (active) =>
  `rounded-full border px-4 py-1.5 text-sm transition ${
    active
      ? "border-red-500 bg-red-500 text-white"
      : "border-steel/30 text-paper hover:border-red-500/50"
  }`;

const catKey = (car) => (car.category || "").trim().toLowerCase();

// Qidiruv: brend yoki model so'zlaridan biri shu harflar bilan boshlansa mos keladi
function matchesSearch(car, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const fullName = `${car.brand} ${car.model}`.toLowerCase();
  return (
    fullName.startsWith(q) || fullName.split(/\s+/).some((w) => w.startsWith(q))
  );
}

function CarCard({ car }) {
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

        <div className="mt-5 flex items-center justify-between border-t border-steel/20 pt-4">
          <span className="text-xl font-bold text-red-500">
            ${car.price.toLocaleString()}
          </span>
          <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
            Batafsil
          </button>
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

function Dashboard() {
  const { user } = useUser();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hammaning mashinalarini olish (token kerak emas)
  useEffect(() => {
    async function loadCatalog() {
      try {
        setError("");
        const res = await fetch(`${API_URL}/api/catalog`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Noma'lum xato");

        setCars(json.data || []);
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

    loadCatalog();
  }, []);

  // Kategoriyalar va ulardagi mashinalar soni (katta-kichik harf farqsiz)
  const categoryMap = new Map();
  for (const c of cars) {
    const key = catKey(c);
    const entry = categoryMap.get(key) || { label: c.category, count: 0 };
    entry.count += 1;
    categoryMap.set(key, entry);
  }
  const categories = [...categoryMap.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );
  const activeCategory = categoryMap.has(category) ? category : "all";

  const searched = cars.filter((c) => matchesSearch(c, search));
  const visibleCars = searched.filter(
    (c) => activeCategory === "all" || catKey(c) === activeCategory,
  );

  // Takliflar: bir xil nomlar takrorlanmasin, 6 tagacha
  const suggestions = [];
  if (search.trim()) {
    const seen = new Set();
    for (const c of searched) {
      const name = `${c.brand} ${c.model}`.toLowerCase();
      if (seen.has(name)) continue;
      seen.add(name);
      suggestions.push(c);
      if (suggestions.length === 6) break;
    }
  }

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
            Salom, {user?.firstName || user?.username || "foydalanuvchi"}!
          </h1>
          <p className="text-steel mt-1">
            {loading
              ? "Yuklanmoqda..."
              : isFiltering
                ? `Barcha mashinalar: ${visibleCars.length} / ${cars.length} ta`
                : `Barcha foydalanuvchilarning mashinalari: ${cars.length} ta`}
          </p>
        </div>

        <Link
          to="/mycars"
          className="rounded-full border border-steel/30 px-6 py-2.5 text-sm font-medium text-paper transition hover:border-red-500/50"
        >
          Mening mashinalarim →
        </Link>
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
            {categories.map(([key, { label, count }]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={chipClass(activeCategory === key)}
              >
                {label} ({count})
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
            Hali hech kim mashina qo'shmagan. "Mening mashinalarim" sahifasida
            birinchisini qo'shing.
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
          : visibleCars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </div>
  );
}

export default Dashboard;
