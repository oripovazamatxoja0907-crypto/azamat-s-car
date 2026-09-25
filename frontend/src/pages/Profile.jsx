import { UserButton, useUser } from "@clerk/react";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-carbon text-paper font-sans px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Link
            to="/dashboard"
            className="absolute -top-2 -right-2 w-9 h-9 flex items-center justify-center rounded-full text-steel hover:text-paper hover:bg-white/10 transition text-xl"
            aria-label="Yopish"
          >
            ✕
          </Link>

          <h1 className="font-display text-4xl font-extrabold mb-8 pr-10">
            Mening <span className="text-racing-red">profilim</span>
          </h1>
        </div>

        <div className="bg-night border border-steel/20 rounded-xl p-8 flex items-center gap-6">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { userButtonAvatarBox: "w-16 h-16" } }}
          />
          <div>
            <p className="font-display text-xl font-semibold">
              {user?.fullName || "Foydalanuvchi"}
            </p>
            <p className="text-steel text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-night border border-steel/20 rounded-xl p-5">
            <p className="text-steel text-sm mb-1">Ro'yxatdan o'tgan sana</p>
            <p className="font-semibold">
              {user?.createdAt?.toLocaleDateString("uz-UZ")}
            </p>
          </div>
          <div className="bg-night border border-steel/20 rounded-xl p-5">
            <p className="text-steel text-sm mb-1">Holat</p>
            <p className="font-semibold text-volt">Faol</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
