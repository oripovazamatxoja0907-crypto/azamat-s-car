import { SignInButton, SignUpButton, useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import heroImg from "../assets/hero-f40.jpg";

function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-carbon">
        <p className="text-steel">Yuklanmoqda...</p>
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center bg-cover"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundPosition: "center 75%",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-paper mb-4 tracking-tight">
          Car<span className="text-racing-red">Vibe</span>
        </h1>
        <p className="font-sans text-lg md:text-xl text-steel max-w-xl mb-10 mx-auto">
          Sevimli avtomobillaringiz — bir joyda.
          <br />
          Xush kelibsiz.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <SignUpButton mode="modal">
            <button
              className="px-8 py-3 rounded-lg text-white font-semibold transition hover:brightness-110"
              style={{ backgroundColor: "#E10600" }}
            >
              Boshlash
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-8 py-3 rounded-lg border-2 border-white/70 text-white font-semibold transition hover:bg-white/10">
              Kirish
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}

export default Home;