/**
 * Dayhaven Landing Page — "Warm Stack" Design
 * 
 * Design Philosophy: Tactile Card Interface
 * - Warm cream base (#FBF8F3), color-blocked rounded cards
 * - Fraunces (serif) for headlines, Plus Jakarta Sans for body
 * - Dark charcoal pill CTAs, generous whitespace
 * - Mobile-first, editorial feel
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  CalendarDays,
  UtensilsCrossed,
  CloudSun,
  BookOpen,
  Bell,
  Check,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// CDN image URLs
const IMAGES = {
  heroAbstract: "https://d2xsxph8kpxj0f.cloudfront.net/119477265/SW7TqXy4MkLdwbWq7dopH2/hero-abstract-QdNaz7TaxEZB6qqSav9Cab.webp",
  dashboard: "https://d2xsxph8kpxj0f.cloudfront.net/119477265/SW7TqXy4MkLdwbWq7dopH2/dashboard-preview-dFi4WeKN3hFU7RrGbuELY6.webp",
  calendar: "https://d2xsxph8kpxj0f.cloudfront.net/119477265/SW7TqXy4MkLdwbWq7dopH2/feature-calendar-4uTSgchDmWKAHmpDumKMbz.webp",
  inbox: "https://d2xsxph8kpxj0f.cloudfront.net/119477265/SW7TqXy4MkLdwbWq7dopH2/feature-inbox-9e2a8iC55aNaYnx2mjeB5K.webp",
  dots: "https://d2xsxph8kpxj0f.cloudfront.net/119477265/SW7TqXy4MkLdwbWq7dopH2/decorative-dots-b3aNMMfzchLWtQ9Hv2nASn.webp",
};

/* ─── Reusable Animated Section Wrapper ─── */
function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Logo Component ─── */
function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
          dark
            ? "bg-white/10 text-white"
            : "bg-charcoal text-cream"
        }`}
      >
        DH
      </div>
      <span
        className={`font-display font-semibold text-xl tracking-tight ${
          dark ? "text-white" : "text-charcoal"
        }`}
      >
        Dayhaven
      </span>
    </div>
  );
}

/* ─── Pill Button Component ─── */
function PillButton({
  children,
  variant = "dark",
  size = "md",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-body font-semibold rounded-full transition-all duration-300 active:scale-95";
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
  };
  const variantClasses = {
    dark: "bg-charcoal text-white hover:bg-charcoal-light hover:shadow-lg",
    light: "bg-white text-charcoal hover:bg-cream-dark hover:shadow-lg",
    outline:
      "bg-transparent text-charcoal border-2 border-charcoal/20 hover:border-charcoal/40 hover:bg-charcoal/5",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 1: HERO
   ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 container flex items-center justify-between py-5">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
          >
            Pricing
          </a>
        </div>
        <PillButton size="sm">Sign up free</PillButton>
      </nav>

      {/* Hero Content */}
      <div className="container flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-8 pb-20 lg:pt-0">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-sage/20 text-sage-dark px-4 py-2 rounded-full mb-6 w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Now in early access</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display font-bold text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-7xl tracking-tight text-charcoal mb-6"
          >
            Your school,
            <br />
            <span className="text-sage-dark">simplified.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-warm-gray leading-relaxed mb-8 max-w-md"
          >
            Dayhaven pulls together everything you need to manage your kids'
            school life — schedules, lunch menus, teacher emails, and more —
            into one beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <PillButton size="lg">
              Sign up free
              <ArrowRight className="w-5 h-5 ml-2" />
            </PillButton>
            <span className="text-sm text-warm-gray">
              No credit card required
            </span>
          </motion.div>
        </div>

        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-1 flex justify-center lg:justify-end w-full max-w-sm lg:max-w-md"
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="relative w-[280px] sm:w-[300px] lg:w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-charcoal/15 border-[8px] border-charcoal/90">
              <img
                src={IMAGES.dashboard}
                alt="Dayhaven dashboard showing today's schedule, lunch menu, and weather"
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            {/* Floating decorative card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="absolute -left-12 top-1/4 bg-coral/90 rounded-2xl px-4 py-3 shadow-lg hidden sm:block"
            >
              <p className="text-sm font-semibold text-charcoal">
                Field trip tomorrow!
              </p>
              <p className="text-xs text-charcoal/70 mt-0.5">
                Permission slip signed ✓
              </p>
            </motion.div>
            {/* Floating decorative card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="absolute -right-8 bottom-1/3 bg-sage/90 rounded-2xl px-4 py-3 shadow-lg hidden sm:block"
            >
              <p className="text-sm font-semibold text-charcoal">
                Lunch: Taco Tuesday 🌮
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-warm-gray/60 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-charcoal/15 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-charcoal/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2: PROBLEM STATEMENT
   ═══════════════════════════════════════════════ */
function ProblemSection() {
  const painPoints = [
    {
      icon: Mail,
      label: "Teacher emails",
      color: "bg-coral",
    },
    {
      icon: CalendarDays,
      label: "School calendar",
      color: "bg-sage",
    },
    {
      icon: UtensilsCrossed,
      label: "Lunch menus",
      color: "bg-amber",
    },
    {
      icon: CloudSun,
      label: "Weather alerts",
      color: "bg-teal",
    },
    {
      icon: BookOpen,
      label: "Homework",
      color: "bg-coral-light",
    },
    {
      icon: Bell,
      label: "Announcements",
      color: "bg-sage-light",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative background dots */}
      <div
        className="absolute top-0 right-0 w-72 h-72 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url(${IMAGES.dots})`,
          backgroundSize: "cover",
        }}
      />

      <div className="container">
        <FadeInSection className="max-w-3xl">
          <p className="text-sm font-semibold text-coral-dark uppercase tracking-widest mb-4">
            The problem
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-6">
            School info is{" "}
            <span className="italic text-warm-gray">everywhere.</span>
            <br />
            Except where you need it.
          </h2>
          <p className="text-lg text-warm-gray leading-relaxed max-w-2xl mb-12">
            Between email chains, school apps, paper flyers, and group chats —
            keeping track of your kids' school life feels like a second job. Important
            details slip through the cracks. Permission slips get lost. Lunch menus
            are a mystery.
          </p>
        </FadeInSection>

        {/* Pain point cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
          {painPoints.map((point, i) => (
            <FadeInSection key={point.label} delay={0.1 * i}>
              <div
                className={`${point.color} rounded-2xl p-4 sm:p-5 transition-transform duration-300 hover:scale-[1.03]`}
              >
                <point.icon className="w-5 h-5 text-charcoal/70 mb-3" />
                <p className="font-semibold text-sm sm:text-base text-charcoal">
                  {point.label}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.6} className="mt-12">
          <div className="bg-charcoal rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl">
            <p className="font-display text-xl sm:text-2xl font-semibold text-white leading-snug">
              Dayhaven brings it all together — automatically — so you never miss
              what matters.
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3: FEATURE SHOWCASE
   ═══════════════════════════════════════════════ */
function FeatureShowcase() {
  const features = [
    {
      tag: "Dashboard",
      title: "Everything at a glance",
      description:
        "Your morning briefing: today's schedule, lunch menu, weather, and anything that needs your attention — all on one screen.",
      image: IMAGES.dashboard,
      color: "bg-sage",
      tagColor: "bg-sage-dark text-white",
    },
    {
      tag: "Calendar",
      title: "Never miss a date",
      description:
        "School events, deadlines, holidays, and parent-teacher conferences — all synced and color-coded. Set reminders so nothing slips.",
      image: IMAGES.calendar,
      color: "bg-amber",
      tagColor: "bg-amber-dark text-white",
    },
    {
      tag: "Communications",
      title: "Teacher emails, summarized",
      description:
        "AI-powered summaries of every teacher email and school announcement. See what matters in seconds, not minutes of scrolling.",
      image: IMAGES.inbox,
      color: "bg-teal",
      tagColor: "bg-teal-dark text-white",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-cream-dark/50">
      <div className="container">
        <FadeInSection className="mb-16">
          <p className="text-sm font-semibold text-sage-dark uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight max-w-xl">
            Built for the way
            <br />
            parents actually live.
          </h2>
        </FadeInSection>

        <div className="space-y-16 sm:space-y-24">
          {features.map((feature, i) => (
            <FadeInSection key={feature.tag}>
              <div
                className={`flex flex-col ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-8 lg:gap-16`}
              >
                {/* Phone mockup */}
                <div className="flex-shrink-0">
                  <div
                    className={`${feature.color}/30 rounded-[2rem] p-4 sm:p-6`}
                  >
                    <div className="w-[240px] sm:w-[260px] rounded-[2rem] overflow-hidden shadow-xl border-[6px] border-charcoal/90">
                      <img
                        src={feature.image}
                        alt={`${feature.tag} feature preview`}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 max-w-lg">
                  <span
                    className={`inline-block ${feature.tagColor} text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4`}
                  >
                    {feature.tag}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-warm-gray text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Additional feature pills */}
        <FadeInSection className="mt-20">
          <p className="text-sm font-semibold text-warm-gray mb-6 text-center">
            Plus so much more
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Homework Tracking",
              "Weather Forecasts",
              "District Alerts",
              "Multi-Child Support",
              "Push Notifications",
              "Weekly Digest",
            ].map((item) => (
              <span
                key={item}
                className="bg-white/80 border border-charcoal/8 text-charcoal/70 text-sm font-medium px-4 py-2 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4: HOW IT WORKS
   ═══════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect your school",
      description:
        "Enter your school or district. Dayhaven automatically finds and connects to available data sources — calendars, menus, newsletters, and more.",
      color: "bg-sage",
      accent: "text-sage-dark",
    },
    {
      number: "02",
      title: "Add your kids",
      description:
        "Tell us your children's names, grades, and teachers. We'll personalize everything — from relevant announcements to the right lunch menu.",
      color: "bg-coral",
      accent: "text-coral-dark",
    },
    {
      number: "03",
      title: "Stay in the loop",
      description:
        "Open your dashboard each morning for a complete briefing. Get smart notifications for things that need your attention. That's it.",
      color: "bg-amber",
      accent: "text-amber-dark",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="container">
        <FadeInSection className="text-center mb-16">
          <p className="text-sm font-semibold text-teal-dark uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Three steps. That's it.
          </h2>
        </FadeInSection>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <FadeInSection key={step.number} delay={0.15 * i}>
              <div
                className={`${step.color} rounded-3xl p-6 sm:p-8 h-full transition-transform duration-300 hover:scale-[1.02]`}
              >
                <span
                  className={`font-display font-bold text-4xl sm:text-5xl ${step.accent} opacity-40`}
                >
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-charcoal mt-4 mb-3">
                  {step.title}
                </h3>
                <p className="text-charcoal/70 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5: PRICING
   ═══════════════════════════════════════════════ */
function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-cream-dark/50">
      <div className="container">
        <FadeInSection className="text-center mb-16">
          <p className="text-sm font-semibold text-amber-dark uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Simple, honest pricing.
          </h2>
          <p className="text-warm-gray text-lg max-w-md mx-auto">
            Start free. Upgrade when you're ready for the full experience.
          </p>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <FadeInSection>
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-charcoal/6 h-full flex flex-col">
              <div className="mb-6">
                <span className="inline-block bg-sage/30 text-sage-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                  Free
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl sm:text-5xl text-charcoal">
                    $0
                  </span>
                  <span className="text-warm-gray text-sm">/forever</span>
                </div>
                <p className="text-warm-gray text-sm mt-2">
                  Perfect for getting started
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 child profile",
                  "Daily dashboard",
                  "School calendar sync",
                  "Lunch menu access",
                  "Basic notifications",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-sage-dark mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-charcoal/80">{item}</span>
                  </li>
                ))}
              </ul>

              <PillButton variant="outline" className="w-full">
                Get started free
              </PillButton>
            </div>
          </FadeInSection>

          {/* Pro tier */}
          <FadeInSection delay={0.15}>
            <div className="bg-charcoal rounded-3xl p-7 sm:p-8 h-full flex flex-col relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-coral/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/15 rounded-full blur-2xl" />

              <div className="relative mb-6">
                <span className="inline-block bg-coral/30 text-coral-light text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                  Pro
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl sm:text-5xl text-white">
                    $39
                  </span>
                  <span className="text-white/50 text-sm">/year per household</span>
                </div>
                <p className="text-white/50 text-sm mt-2">
                  That's less than $3.25/month
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1 relative">
                {[
                  "Unlimited child profiles",
                  "AI email summaries",
                  "Smart notifications",
                  "Homework tracking",
                  "Weather integration",
                  "Weekly digest email",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </li>
                ))}
              </ul>

              <PillButton variant="light" className="w-full relative">
                Start free trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </PillButton>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 6: FOOTER
   ═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 sm:py-20">
      <div className="container">
        {/* CTA band */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Ready to simplify
            <br />
            school mornings?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
            Join thousands of parents who start their day with Dayhaven.
          </p>
          <PillButton variant="light" size="lg">
            Sign up free
            <ArrowRight className="w-5 h-5 ml-2" />
          </PillButton>
        </FadeInSection>

        {/* Footer links */}
        <div className="border-t border-white/10 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <Logo dark />
            <p className="text-white/40 text-sm mt-3 leading-relaxed">
              Your personal school assistant.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white/70 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "Roadmap", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white/70 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white/70 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Privacy", "Terms", "Security"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Dayhaven. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with care for parents, by parents.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   PAGE ASSEMBLY
   ═══════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <HeroSection />
      <ProblemSection />
      <FeatureShowcase />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </div>
  );
}
