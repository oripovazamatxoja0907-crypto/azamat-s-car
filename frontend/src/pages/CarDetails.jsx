import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FALLBACK_IMG = "https://placehold.co/800x500/1a1a1a/666?text=Rasm+yo'q";

function Spec({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-steel/20 bg-night p-4">
      <p className="text-xs text-steel">
        {icon} {label}
      </p>
      <p className="mt-1 font-medium text-paper">{value}</p>
    </div>
  );
}

function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCar() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/catalog/${id}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Noma'lum xato");
        if (!ignore) setCar(json.data);
      } catch (err) {
        if (!ignore) {
          setError(
            err.message === "Failed to fetch"
              ? "Serverga ulanib bo'lmadi. Backend ishlayaptimi?"
              : err.message,
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCar();

    // Sahifa almashsa, eski so'rov natijasi e'tiborga olinmasin
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-6 inline-block text-sm text-steel transition hover:text-paper"
      >
        ← Barcha mashinalarga qaytish
      </Link>

      {loading && (
        <div className="grid animate-pulse gap-8 lg:grid-cols-2">
          <div className="aspect-16/10 rounded-2xl bg-steel/10" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-steel/10" />
            <div className="h-6 w-1/3 rounded bg-steel/10" />
            <div className="h-24 w-full rounded bg-steel/10" />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {car && !loading && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Rasm */}
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-steel/20">
            <img
              src={car.imageUrl}
              alt={`${car.brand} ${car.model}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-paper backdrop-blur">
              {car.category}
            </span>
          </div>

          {/* Ma'lumot */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-bold text-paper">
                {car.brand} {car.model}
              </h1>
              <span className="whitespace-nowrap rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-paper">
                ⭐ {car.rating.toFixed(1)} / 5
              </span>
            </div>

            <p className="mt-1 text-steel">{car.year}-yil</p>

            <p className="mt-4 text-4xl font-bold text-red-500">
              ${car.price.toLocaleString()}
            </p>

            {car.description && (
              <p className="mt-5 leading-relaxed text-paper/90">
                {car.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Spec icon="⛽" label="Yoqilg'i" value={car.fuelType} />
              <Spec icon="⚙️" label="Uzatma" value={car.transmission} />
              <Spec
                icon="🛣"
                label="Yurgan masofa"
                value={
                  car.mileage === 0
                    ? "Yangi"
                    : `${car.mileage.toLocaleString()} km`
                }
              />
              <Spec icon="🎨" label="Rang" value={car.color} />
              <Spec icon="🏷" label="Kategoriya" value={car.category} />
              <Spec icon="📅" label="Yil" value={car.year} />
            </div>

            <p className="mt-6 text-xs text-steel">
              Qo'shilgan sana: {new Date(car.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetails;
