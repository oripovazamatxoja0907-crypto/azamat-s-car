import { Link } from "react-router-dom";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function Navbar() {
  return (
    <header className="bg-black/95 border-b border-white/10 sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-xl font-bold text-paper tracking-tight"
        >
          Car<span className="text-racing-red">Vibe</span>
        </Link>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition">
                Kirish
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "#E10600" }}
              >
                Ro'yxatdan o'tish
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              to="/profile"
              className="text-sm font-semibold text-white/80 hover:text-white transition"
            >
              Profil
            </Link>
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
