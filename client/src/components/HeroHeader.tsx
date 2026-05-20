/**
 * HeroHeader — Dayhaven
 * Family photo hero banner with "Good morning, Stanfield" greeting.
 * Photo positioned to show all four faces on the right. Text anchored left.
 * Dark overlay fades from left (heavier) to right (lighter).
 */
import { useWeek } from "@/contexts/WeekContext";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";

export default function HeroHeader() {
  const { meta } = useWeek();

  return (
    <header className="relative overflow-hidden" style={{ minHeight: "220px" }}>
      {/* Family photo — anchored right so all four faces are visible */}
      <div className="absolute inset-0">
        <img
          src={FAMILY_PHOTO}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition: "50% 25%" }}
        />
        {/* Strong dark overlay on the LEFT where text sits, fading to transparent on the right */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.40) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Subtle top and bottom vignette for polish */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Content — left-aligned, max 240px width so it never overlaps the faces */}
      <div className="relative z-10 px-5 pt-10 pb-6 sm:px-6 sm:pt-12 max-w-lg mx-auto">
        <div className="flex items-start justify-between">
          <div className="max-w-[240px]" style={{ opacity: 1, transform: "none" }}>
            <h1 className="font-display text-[1.75rem] sm:text-[2.25rem] leading-[1.1] text-white tracking-tight drop-shadow-lg">
              Good morning,
              <br />
              <span className="font-display font-semibold">{meta.familyName}</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            {/* Placeholder for future action buttons */}
          </div>
        </div>
      </div>
    </header>
  );
}
