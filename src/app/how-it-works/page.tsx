import Link from "next/link";
import { ArrowLeft, Zap, Star, Sparkles, Users, Calendar } from "lucide-react";

export const metadata = {
  title: "How Motion Works | MotionRadar",
  description:
    "Understand Motion in under a minute. Stars, rarity, Score Boosts, and how to build a winning lineup.",
};

const steps = [
  {
    icon: Zap,
    title: "Motion Score",
    subtitle: "Attention Velocity",
    description:
      "Not about follower count. Motion Score tracks how fast a creator\u2019s cultural relevance is rising or falling across X, Instagram, TikTok, and YouTube.",
    detail: "Higher velocity = higher score.",
  },
  {
    icon: Star,
    title: "Stars",
    subtitle: "14-day heat",
    description:
      "Stars reflect how hot a creator has been over the trailing ~14 days. Higher stars cost more toward the Star Cap.",
    detail: "You can\u2019t just stack the 5 hottest names.",
  },
  {
    icon: Sparkles,
    title: "Rarity & Boosts",
    subtitle: "Score multiplier",
    description:
      "Every card has a rarity. Higher rarity applies a bigger Score Boost (multiplier) to that creator\u2019s raw Motion Score.",
    detail: "This is how you multiply points.",
  },
  {
    icon: Users,
    title: "Build a Lineup",
    subtitle: "5 creators, Star Cap",
    description:
      "Draft 5 different creators. Your lineup must stay under the Star Cap. Pair lower-star creators with high-rarity cards for the best efficiency.",
    detail: "Low-star + high-rarity is the meta.",
  },
  {
    icon: Calendar,
    title: "Weekly Loop",
    subtitle: "Mon → Fri",
    description:
      "Lineups lock Monday. Scores update every 4 hours. Everything finalizes Friday. Then cards unlock for the next week.",
    detail: "Scout before Monday lock.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Radar</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            Mogathon
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            How Motion Works
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Understand the game in under a minute. Stars, rarity, boosts, and lineup strategy.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 sm:space-y-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="group relative bg-[#121215] border border-white/[0.06] rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-zinc-500">
                        0{i + 1}
                      </span>
                      <h2 className="text-lg font-semibold text-white">
                        {step.title}
                      </h2>
                    </div>
                    <p className="text-xs text-emerald-400 font-medium mb-2">
                      {step.subtitle}
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategy callout */}
        <div className="mt-8 sm:mt-10 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-emerald-300 mb-2">
            The Winning Pattern
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Pair a lower-star creator entering a catalyst week with a high-rarity card. You stay under the Star Cap while the Score Boost multiplies a rising Motion Score. That is how you beat lineups that just stack last week\u2019s winners.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors text-center"
          >
            Open the Radar
          </Link>
          <a
            href="https://seats.motion.game"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors text-center"
          >
            Claim Motion Seat
          </a>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-zinc-500">
        Built for Mogathon by{" "}
        <a
          href="https://github.com/kellycryptos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300"
        >
          @kellycryptos
        </a>
      </footer>
    </div>
  );
}
