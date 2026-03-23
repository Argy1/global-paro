import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function JoinMissionBanner() {
  return (
    <section
      className="py-16 px-6"
      style={{ background: "linear-gradient(to right, #03989E, #015779)" }}
    >
      <div className="container max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
          Join Our Mission
        </h2>
        <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
          Ready to explore international nursing opportunities? Take your first step toward a global career today.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3 rounded-full text-base transition-all hover:bg-white/90 hover:scale-105 shadow-lg"
          style={{ color: "#015779" }}
        >
          Register Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
