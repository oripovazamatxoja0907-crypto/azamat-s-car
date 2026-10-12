import { Link, NavLink } from "react-router-dom";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${
    isActive ? "text-white" : "text-white/70 hover:text-white"
  }`;

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
            <nav className="flex items-center gap-3 sm:gap-6">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/mycars" className={navLinkClass}>
                Mashinalarim
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profil
              </NavLink>
            </nav>
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
