/**
 * HeroHeader — SchoolBase
 * Family photo hero banner: photo positioned right-center so all four faces
 * are visible on the right. Title text anchored to the left where the
 * background is less busy. Dark overlay fades from left (heavier) to right (lighter).
 */
import { MapPin } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";
const SCHOOLBASE_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/schoolbase-icon-v2-7LxVP9zbedTFhsiPyARsmC.png";

export default function HeroHeader() {
  const { meta, week } = useWeek();

  return (
    <header className="relative overflow-hidden rounded-b-3xl" style={{ minHeight: "280px" }}>
      {/* Family photo — anchored right so all four faces are visible */}
      <div className="absolute inset-0">
        <img
          src={FAMILY_PHOTO}
          alt="The Stanfield family at Universal Studios"
          className="w-full h-full object-cover"
          style={{ objectPosition: "70% center" }}
        />
        {/* Strong dark overlay on the LEFT where text sits, fading to transparent on the right */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)"
        }} />
        {/* Subtle top and bottom vignette for polish */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)"
        }} />
      </div>

      {/* Content — left-aligned, max 55% width so it never overlaps the faces */}
      <div className="relative z-10 px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
        <div className="max-w-[55%] sm:max-w-[50%]">

          {/* App icon + SchoolBase name */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={SCHOOLBASE_ICON}
              alt="SchoolBase"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg shrink-0"
            />
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-none drop-shadow-lg">
                SchoolBase
              </h1>
              <p className="text-amber-200 text-sm font-medium tracking-wide drop-shadow-md mt-0.5">
                {meta.familyName} Family
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/80 text-sm drop-shadow-md">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {meta.schoolName}
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline">{meta.schoolAddress}</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 bg-black/35 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm border border-white/25">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            Week of {week.weekLabel}
          </div>
        </div>
      </div>
    </header>
  );
}
