/**
 * HeroHeader — Sunrise Command Center
 * Family photo hero banner with dark gradient overlay for text readability.
 * Uses DM Serif Display for the title, Plus Jakarta Sans for body.
 */
import { MapPin, GraduationCap } from "lucide-react";
import data from "@/data/weeklyReport.json";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";

export default function HeroHeader() {
  return (
    <header className="relative overflow-hidden rounded-b-3xl">
      {/* Family photo background */}
      <div className="absolute inset-0">
        <img
          src={FAMILY_PHOTO}
          alt="The Stanfield family"
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layer dark gradient: strong at top and bottom, lighter in middle to let the photo show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
        {/* Extra left-side darkening to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium tracking-wide uppercase drop-shadow-md">
              Weekly School Report
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-3 drop-shadow-lg">
            {data.meta.familyName} Family
            <br />
            <span className="text-amber-200">School Dashboard</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/90 text-sm drop-shadow-md">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {data.meta.schoolName}
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span>{data.meta.schoolAddress}</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm border border-white/25">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Week of {data.meta.weekLabel}
          </div>
        </div>
      </div>
    </header>
  );
}
