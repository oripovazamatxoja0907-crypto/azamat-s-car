import { useUser } from "@clerk/react";

function Dashboard() {
  const { user } = useUser();

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

      <div className="bg-night rounded-2xl border border-steel/20 p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-paper mb-2">
          Hozircha hech narsa yo'q
        </h2>
        <p className="text-steel mb-6">
          Keyingi darslarda bu yerga kolleksiya elementlarini qo'shamiz.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
