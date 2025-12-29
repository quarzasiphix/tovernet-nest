"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const lang = navigator.language || "en";
    if (lang.startsWith("pl")) {
      window.location.href = "/pl";
    } else {
      window.location.href = "/en";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <p className="text-white text-xl">Redirecting…</p>
    </div>
  );
}
