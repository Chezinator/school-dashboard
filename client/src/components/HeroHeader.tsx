/**
 * HeroHeader — Dayhaven aesthetic
 * Family photo hero with warm overlay, Fraunces display type, editorial feel.
 * Photo anchored right so all four faces are visible.
 */
import { MapPin } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";
const SCHOOLBASE_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/schoolbase-icon-v2-7LxVP9zbedTFhsiPyARsmC.png";

export default function HeroHeader() {
  const { meta, week } = useWeek();

  return (
    <header className="relative overflow-hidden rounded-b-[2rem]" style={{ minHeight: "280px" }}>
      {/* Family photo — anchored right */}
      <div className="absolute inset-0">
        <img
          src={FAMILY_PHOTO}
          alt="The Stanfield family at Universal Studios"
          className="w-full h-full object-cover"
          style={{ objectPosition: "70% center" }}
        />
        {/* Warm dark overlay — heavier on left for text */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(30,25,20,0.85) 0%, rgba(30,25,20,0.65) 35%, rgba(30,25,20,0.2) 65%, rgba(30,25,20,0.05) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(30,25,20,0.3) 0%, transparent 40%, rgba(30,25,20,0.25) 100%)"
        }} />
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-10 px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
        <div className="max-w-[55%] sm:max-w-[50%]">
          {/* App icon + name */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={SCHOOLBASE_ICON}
              alt="SchoolBase"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg shrink-0"
            />
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-none drop-shadow-lg tracking-tight">
                SchoolBase
              </h1>
              <p className="text-amber-200/90 text-sm font-medium tracking-wide drop-shadow-md mt-0.5">
                {meta.familyName} Family
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/75 text-sm drop-shadow-md">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {meta.schoolName}
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline">{meta.schoolAddress}</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0" />
            Week of {week.weekLabel}
          </div>
        </div>
      </div>
    </header>
  );
}
