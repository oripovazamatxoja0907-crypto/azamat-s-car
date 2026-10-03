import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";

const API_URL = "http://localhost:3000";
const FALLBACK_IMG = "https://placehold.co/600x400/1a1a1a/666?text=Rasm+yo'q";

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
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/cars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (!res.ok) {
          console.error("Xato:", res.status, json);
          setError(`Xato ${res.status}: ${json.error || "Noma'lum xato"}`);
          return;
        }

        setCars(json.data || []);
      } catch (err) {
        console.error(err);
        setError("Serverga ulanib bo'lmadi. Backend ishlayaptimi?");
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [isLoaded, isSignedIn]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-paper">
          Salom, {user?.firstName || user?.username || "foydalanuvchi"}!
        </h1>
        <p className="text-steel mt-1">
          Bu sizning shaxsiy kolleksiya boshqaruv panelingiz.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && cars.length === 0 && (
        <div className="bg-night rounded-2xl border border-steel/20 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-paper mb-2">
            Hozircha hech narsa yo'q
          </h2>
          <p className="text-steel">Kolleksiyada mashinalar topilmadi.</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : cars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </div>
  );
}

export default Dashboard;
