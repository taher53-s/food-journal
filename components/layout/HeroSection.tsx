"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";

interface HeroFloatingImage {
  src: string;
  alt: string;
  x: string;
  y: string;
  size: number;
  rotate: number;
  delay: number;
  parallaxFactor: number;
}

const FALLBACK_IMAGES = [
  "/images/1441-pizzeria/IMG_5638.jpg",
  "/images/1441-pizzeria/IMG_5641.jpg",
  "/images/1441-pizzeria/IMG_5642.jpg",
  "/images/1441-pizzeria/IMG_5645.jpg",
  "/images/1441-pizzeria/IMG_5647.jpg",
  "/images/1441-pizzeria/IMG_5648.jpg",
  "/images/1441-pizzeria/IMG_5651.jpg",
  "/images/1441-pizzeria/IMG_5658.jpg",
  "/images/1441-pizzeria/IMG_5662.jpg",
  "/images/1441-pizzeria/IMG_5663.jpg",
  "/images/1441-pizzeria/IMG_5664.jpg",
  "/images/1441-pizzeria/IMG_5666.jpg",
  "/images/1441-pizzeria/IMG_5668.JPEG",
];

function FloatingImage({ img, scrollYProgress }: { img: HeroFloatingImage; scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -120 * img.parallaxFactor * 10]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [img.rotate, img.rotate * 0.5, img.rotate * 1.5]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: img.delay + 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ y, rotate, left: img.x, top: img.y }}
      className="absolute hidden md:block pointer-events-none select-none"
    >
      <motion.div
        animate={{ y: [0, -14, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8 + img.delay * 2, repeat: Infinity, ease: "easeInOut", delay: img.delay }}
        className="relative"
        style={{ width: img.size, height: img.size }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)" }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)" }}
        />
      </motion.div>
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 18 });

  useEffect(() => {
    if (!isInView) return;
    spring.set(target);
    const unsubscribe = spring.on("change", (v) => setCount(Math.round(v * 10) / 10));
    return () => unsubscribe();
  }, [isInView, spring, target]);

  return <span ref={ref}>{suffix === "/10" ? count.toFixed(1) : count}{suffix && !suffix.startsWith("/") ? suffix : suffix === "/10" ? suffix : ""}</span>;
}

function StatCard({ icon, label, value, suffix, index }: { icon: string; label: string; value: number; suffix?: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative rounded-3xl p-px text-center overflow-hidden">
        {/* Gradient border on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(245,158,11,0.1) 50%, rgba(27,94,67,0.3) 100%)" }} />
        <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl border border-white/[0.07] rounded-[calc(3rem-1px)] p-6 md:p-8 text-center overflow-hidden transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-white/[0.12] hover:-translate-y-1 cursor-default h-full">
          {/* Gold shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 40%, rgba(245,158,11,0.03) 100%)" }}
          />
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)" }} />
          <div className="relative z-10">
            <div className="text-4xl mb-3">{icon}</div>
            <div className="font-display text-4xl md:text-5xl font-bold text-white mb-1 leading-none">
              <AnimatedCounter target={value} suffix={suffix} />
            </div>
            <div className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-white/30">{label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhotoStrip({ images }: { images: string[] }) {
  const srcs = images.length > 0 ? images : FALLBACK_IMAGES.slice(0, 8);
  const duplicated = [...srcs, ...srcs, ...srcs];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0A1A12] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A1A12] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-4 py-2"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {duplicated.map((src, i) => (
          <div key={i} className="relative shrink-0 rounded-xl overflow-hidden" style={{ width: 140, height: 140 }}>
            <img
              src={src}
              alt={`Food ${i}`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroSection({
  stats,
  photoUrls,
}: {
  stats: { restaurants: number; avgRating: number; cuisines: number; mustTries: number };
  photoUrls: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const availableImages = photoUrls.length > 0 ? photoUrls : FALLBACK_IMAGES.slice(0, 6);

  const heroImages: HeroFloatingImage[] = [
    { src: availableImages[0], alt: "Food", x: "4%", y: "16%", size: 135, rotate: -11, delay: 0, parallaxFactor: 0.18 },
    { src: availableImages[1] || availableImages[0], alt: "Food", x: "81%", y: "7%", size: 115, rotate: 9, delay: 0.2, parallaxFactor: 0.22 },
    { src: availableImages[2] || availableImages[0], alt: "Food", x: "87%", y: "50%", size: 145, rotate: -7, delay: 0.4, parallaxFactor: 0.12 },
    { src: availableImages[3] || availableImages[0], alt: "Food", x: "2%", y: "57%", size: 125, rotate: 16, delay: 0.1, parallaxFactor: 0.25 },
    { src: availableImages[4] || availableImages[0], alt: "Food", x: "74%", y: "77%", size: 100, rotate: -17, delay: 0.3, parallaxFactor: 0.15 },
    { src: availableImages[5] || availableImages[0], alt: "Food", x: "14%", y: "76%", size: 112, rotate: 13, delay: 0.5, parallaxFactor: 0.1 },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[100vh] overflow-hidden">
      {/* Deep forest gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #020D09 0%, #051A12 25%, #0A2A1E 50%, #0F3A29 75%, #051A12 100%)",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[5%] w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(27,94,67,0.35) 0%, rgba(27,94,67,0.1) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, 35, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[0%] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.05) 40%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[38%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(94,168,130,0.18) 0%, transparent 70%)",
          filter: "blur(65px)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[5] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Floating food images — desktop */}
      <div className="absolute inset-0 hidden md:block overflow-hidden">
        {heroImages.map((img, i) => (
          <FloatingImage key={i} img={img} scrollYProgress={scrollYProgress} />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY, scale: textScale }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-4 pt-28 pb-52 md:pb-48"
      >
        {/* Label badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2.5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium text-white/50">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-2 h-2 bg-gold-400 rounded-full"
            />
            <span>Personal Food Journal</span>
          </div>
        </motion.div>

        {/* MASSIVE typography */}
        <div className="text-center mb-10 relative">
          <div
            className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245,158,11,0.5) 0%, transparent 70%)",
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-white leading-[0.88] tracking-tight mb-2"
            style={{ fontSize: "clamp(3.5rem, 13vw, 12rem)" }}
          >
            My Food
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic font-light leading-[0.88] tracking-tight block"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 12rem)",
              background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 40%, #D97706 70%, #FCD34D 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Journal
          </motion.span>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-white/35 text-center text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light mb-14"
        >
          A curated record of culinary memories — every meal tells a story worth remembering
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <HeroButton href="/restaurants" primary>
            Explore the Journal
            <ArrowIcon />
          </HeroButton>
          <HeroButton href="/hall-of-fame">
            View Hall of Fame
            <span className="relative z-10 text-sm">🏆</span>
          </HeroButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          <StatCard icon="🍽️" label="Restaurants" value={stats.restaurants} index={0} />
          <StatCard icon="⭐" label="Avg Rating" value={stats.avgRating} suffix="/10" index={1} />
          <StatCard icon="🌍" label="Cuisines" value={stats.cuisines} index={2} />
          <StatCard icon="🥇" label="Must-Tries" value={stats.mustTries} index={3} />
        </motion.div>
      </motion.div>

      {/* Photo strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
        <div className="px-6 max-w-7xl mx-auto mb-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-[10px] uppercase tracking-[0.35em] text-white/15 font-semibold mb-3"
          >
            Recent dishes
          </motion.p>
          <PhotoStrip images={availableImages} />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, #0A1A12)" }}
      />
    </section>
  );
}

function HeroButton({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(false)}
      className={`
        relative flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-semibold
        transition-all duration-300 overflow-hidden group min-h-[48px]
        active:scale-[0.97]
        ${primary
          ? "bg-white text-forest-950 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
          : "border border-white/10 text-white/60 hover:border-white/25 hover:text-white hover:bg-white/[0.06]"
        }
      `}
    >
      {primary && (
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0, originX: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl"
          style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.08), rgba(245,158,11,0.18))" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </a>
  );
}

function ArrowIcon() {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10"
    >
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}
