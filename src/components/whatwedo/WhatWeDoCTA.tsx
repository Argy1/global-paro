import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function WhatWeDoCTA() {
  return (
    <section
      className="py-16 px-6"
      style={{ background: "linear-gradient(to right, #03989E, #015779)" }}
    >
      <div className="container max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
          Register today and let us guide your journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3 rounded-full text-base transition-all hover:bg-white/90 hover:scale-105 shadow-lg"
            style={{ color: "#015779" }}
          >
            Register Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/how-we-do-it"
            className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-full text-base transition-all hover:bg-white/10"
          >
            How We Do It
          </Link>
        </div>
      </div>
    </section>
  );
}
