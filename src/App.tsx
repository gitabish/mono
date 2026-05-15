import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence,
  useSpring,
  useInView
} from "motion/react";
import { 
  Ghost, 
  ArrowRight, 
  Zap, 
  Star, 
  Menu as MenuIcon, 
  X, 
  Instagram, 
  Twitter, 
  MapPin, 
  Coffee,
  Skull,
  MoveDown,
  ArrowUpRight,
  Fingerprint
} from "lucide-react";

// --- Components ---

const TruckLogo = ({ className, size = 64 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size / 2} 
    viewBox="0 0 240 120" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M20 100H220V50H160L140 25H40V50H20V100Z" fill="currentColor" />
    <circle cx="60" cy="100" r="12" fill="white" stroke="currentColor" strokeWidth="4" />
    <circle cx="180" cy="100" r="12" fill="white" stroke="currentColor" strokeWidth="4" />
    <rect x="50" y="40" width="60" height="30" fill="white" rx="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="180" cy="65" r="15" fill="white" />
    <path d="M175 65C175 70 185 70 185 65H175ZM185 60L180 55L175 60" stroke="black" fill="none" strokeWidth="1" />
  </svg>
);

const CoffeeBean = ({ className, size = 32 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.5,8.5c0-3.04-3.36-5.5-7.5-5.5S4.5,5.46,4.5,8.5c0,1.72,1.06,3.25,2.71,4.25 C5.56,13.75,4.5,15.28,4.5,17c0,3.04,3.36,5.5,7.5,5.5s7.5-2.46,7.5-5.5c0-1.72-1.06-3.25-2.71-4.25 C18.44,11.75,19.5,10.22,19.5,8.5z M12,21c-3.31,0-6-1.79-6-4c0-1.3,1.02-2.46,2.69-3.2l6.62,4.87C14.43,19.9,13.27,20.7,12,21z M12,9.15l-5,4.1c-0.62-0.62-1-1.63-1-2.75c0-2.21,2.69-4,6-4c3.31,0,6,1.79,6,4c0,1.12-0.38,2.13-1,2.75 L12,9.15z M12,12.33l-3.31,2.87C9.68,15.71,10.79,16,12,16c1.21,0,2.32-0.29,3.31-0.8L12,12.33z" />
  </svg>
);

const Grain = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-15 mix-blend-multiply noise" />
);

const Marquee = ({ text, reverse = false }: { text: string, reverse?: boolean }) => (
  <div className="py-4 border-y-2 border-ink overflow-hidden bg-ink text-paper font-display uppercase text-2xl md:text-4xl tracking-tighter w-screen -mx-[50vw] left-1/2 relative">
    <div className={`marquee-content ${reverse ? 'flex-row-reverse' : ''} flex gap-8`}>
      {[...Array(10)].map((_, i) => (
        <span key={i} className="px-8 flex items-center gap-4 whitespace-nowrap">
          {text} <Star size={24} className="fill-paper" />
        </span>
      ))}
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, number }: { title: string, subtitle?: string, number: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-ink pb-8">
      <div className="flex items-start gap-4">
        <span className="font-mono text-xl opacity-40">[{number}]</span>
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="font-display text-8xl md:text-[12vw] leading-[0.8] uppercase tracking-tighter"
        >
          {title}
        </motion.h2>
      </div>
      {subtitle && (
        <p className="font-serif italic text-2xl md:text-3xl max-w-sm text-right leading-tight self-end opacity-70">
          {subtitle}
        </p>
      )}
    </div>
  );
};

const Smoke = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-overlay">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: -100, y: '100%', opacity: 0, scale: 0.5 }}
        animate={{ 
          x: ['0%', '10%', '-5%', '15%'],
          y: ['100%', '-20%'],
          opacity: [0, 0.4, 0.6, 0],
          scale: [0.5, 1.5, 2]
        }}
        transition={{ 
          duration: 15 + i * 2,
          repeat: Infinity,
          ease: "linear",
          delay: i * 3
        }}
        className="absolute w-96 h-96 bg-charcoal/20 rounded-full blur-[100px]"
      />
    ))}
  </div>
);

// --- Main App ---

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const blobY3 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <main className="relative min-h-screen selection:bg-ink selection:text-paper bg-paper overflow-x-hidden pt-20">
      <Grain />
      
      {/* SVG Filters for Ink Bleed effect */}
      <svg className="hidden">
        <filter id="ink-bleed">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="ink-bleed" />
          <feComposite in="SourceGraphic" in2="ink-bleed" operator="atop" />
        </filter>
      </svg>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-ink z-[210] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b-2 border-ink bg-paper px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TruckLogo size={40} className="text-ink" />
          <span className="font-display text-2xl uppercase tracking-tighter">NAUGHTY COFFEE</span>
        </div>
        
        <div className="hidden md:flex gap-16 font-mono text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
          <a href="#origin" className="hover:opacity-100 hover:line-through transition-opacity">Origin</a>
          <a href="#brew" className="hover:opacity-100 hover:line-through transition-opacity">Brew</a>
          <a href="#vibe" className="hover:opacity-100 hover:line-through transition-opacity">Aesthetic</a>
          <a href="#contact" className="hover:opacity-100 hover:line-through transition-opacity">Join</a>
        </div>

        <button 
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-3 border-2 border-ink hover:bg-ink hover:text-paper transition-all active:scale-90"
        >
          {isNavOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* Hero Section (Refactored to Fluid/Organic Style) */}
      <section className="relative min-h-[95vh] flex flex-col justify-center px-6 md:px-12 overflow-hidden border-b-2 border-ink bg-paper animate-in fade-in duration-1000">
        <Smoke />
        <div className="absolute inset-0 noise opacity-5 pointer-events-none" />
        <div className="absolute inset-0 scribble-texture opacity-20 pointer-events-none" />
        
        {/* Organic Layered Background Elements */}
        <motion.div style={{ y: blobY1 }} className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] bg-dust/40 blur-[100px] blob pointer-events-none border-4 border-ink/5" />
        <motion.div style={{ y: blobY2 }} className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] bg-charcoal/5 blur-[120px] blob pointer-events-none border-2 border-dashed border-ink/5" />
        <motion.div style={{ y: blobY3 }} className="absolute top-1/4 left-1/4 w-[20vw] h-[20vw] bg-white/30 blur-[80px] blob pointer-events-none mix-blend-overlay" />

        {/* Coffee Stain Doodle */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 left-[-5%] w-64 h-64 opacity-10 pointer-events-none"
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,85.8,-0.8C84.4,14.1,78.3,28.2,69.5,40.1C60.8,52,49.4,61.7,36.5,69.1C23.5,76.5,9.1,81.6,-5.1,80.4C-19.3,79.2,-33.3,71.7,-45.4,62.2C-57.5,52.7,-67.7,41.2,-74.4,28.1C-81.1,15,-84.3,0.3,-82.1,-13.6C-79.9,-27.5,-72.3,-40.7,-61.8,-51.2C-51.3,-61.7,-37.9,-69.6,-24.5,-76.8C-11.1,-84,-5.5,-90.5,5.1,-99.3C15.7,-108.1,26.5,-119.2,31.3,-83.6C36.1,-48,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </motion.div>

        {/* Floating Doodles & Icons */}
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[10%] z-20 opacity-10 hidden lg:block hover:opacity-100 transition-opacity cursor-help"
        >
          <Skull size={180} className="text-ink" />
          <div className="absolute -top-4 -right-4 p-2 bg-white border-2 border-ink rounded-lg font-hand text-xs rotate-12 shadow-sm">Die for it</div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-[5%] z-20 opacity-15 hidden lg:block grayscale"
        >
          <Fingerprint size={120} className="text-ink" />
        </motion.div>

        {/* Floating Hand-Drawn Arrow */}
        <div className="absolute top-[20%] right-[30%] opacity-20 pointer-events-none hidden xl:block">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="doodle-path" d="M10 50C40 10 90 90 180 50M180 50L160 30M180 50L160 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Floating Doodles */}
        <motion.div 
          whileHover={{ scale: 1.2, rotate: 15 }}
          className="absolute top-[10%] left-[20%] z-40 cursor-pointer hidden md:block"
        >
          <div className="p-4 bg-paper paper-cutout rounded-xl opacity-60 hover:opacity-100 transition-all">
              <Star size={32} className="fill-ink" />
              <div className="absolute -bottom-6 left-0 font-hand text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Lucky Charm?</div>
          </div>
        </motion.div>

        {/* Driving Truck Animation */}
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="absolute bottom-[15%] left-0 z-20 opacity-15 pointer-events-none hidden md:block"
        >
          <div className="relative group">
            <svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 100H220V50H160L140 25H40V50H20V100Z" fill="currentColor" className="text-ink" />
              {/* Wheels */}
              <motion.circle 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                cx="60" cy="100" r="12" fill="white" stroke="currentColor" strokeWidth="4" className="text-ink" 
              />
              <motion.circle 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                cx="180" cy="100" r="12" fill="white" stroke="currentColor" strokeWidth="4" className="text-ink" 
              />
              {/* Window */}
              <rect x="50" y="40" width="60" height="30" fill="white" rx="2" stroke="currentColor" strokeWidth="2" className="text-ink" />
              {/* Coffee Logo on Truck */}
              <circle cx="180" cy="65" r="15" fill="white" />
              <path d="M175 65C175 70 185 70 185 65H175ZM185 60L180 55L175 60" stroke="black" fill="none" strokeWidth="1" />
            </svg>
            <div className="absolute top-6 left-14 font-hand text-xs text-ink rotate-[-2deg] bg-white px-2 py-1 border-[1px] border-ink rounded pointer-events-auto cursor-default hover:scale-110 transition-transform">
                Cafe on wheels.
            </div>
            {/* Smoke from exhaust */}
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2], y: [0, -20, -40], x: [0, -10, -20] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-4 left-4 w-4 h-4 bg-ink/20 rounded-full blur-sm"
            />
          </div>
        </motion.div>

        {/* Floating Coffee Beans */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0], 
              rotate: [0, 360],
              x: [0, i % 2 === 0 ? 30 : -30, 0]
            }}
            transition={{ 
              duration: 6 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute opacity-10 pointer-events-none hidden lg:block"
            style={{ 
              top: `${15 + (i * 15)}%`, 
              left: `${10 + (i * 20)}%`,
              zIndex: 40 
            }}
          >
            <CoffeeBean size={32 + (i * 8)} className="text-ink" />
          </motion.div>
        ))}

        {/* Floating 2D Truck Illustration */}
        <motion.div 
          animate={{ x: [-10, 10, -10], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[25%] right-[10%] z-40 hidden lg:flex flex-col items-center group cursor-pointer"
        >
          <div className="p-4 bg-paper paper-cutout rounded-2xl group-hover:bg-ink group-hover:text-paper transition-all duration-500">
            <TruckLogo size={120} className="transition-colors" />
          </div>
          <div className="mt-4 font-hand text-xl bg-white border-2 border-ink px-4 py-1 rotate-[-3deg] shadow-lg group-hover:rotate-0 transition-transform">
            Naughty on Wheels
          </div>
        </motion.div>

        <div className="relative z-30 max-w-7xl mx-auto w-full pt-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-24">
            
            <div className="flex-1 relative order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                className="relative"
              >
                <div className="font-hand text-5xl md:text-8xl text-ink/20 mb-[-3rem] ml-4 md:ml-24 rotate-[-8deg] block animate-float pointer-events-none">
                  Wake the dead.
                </div>
                <h1 className="font-display text-[20vw] md:text-[14vw] leading-[0.8] uppercase tracking-[-0.04em] ink-bleed select-none flex flex-col text-ink">
                  <span className="block">DARKER</span>
                  <span className="italic font-serif normal-case text-[10vw] md:text-[7vw] tracking-normal -mt-[2vw] ml-[10vw] opacity-90">than</span>
                  <span className="block -mt-[2vw]">NOIR</span>
                </h1>
                
                <div className="absolute -bottom-12 -left-4 md:-left-8 space-y-2">
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-4 py-2 px-6 bg-ink text-paper rounded-full font-mono text-[10px] uppercase font-black tracking-widest shadow-lg border-2 border-paper/10"
                  >
                    <Zap size={14} className="fill-paper" /> Original Alchemy
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 relative order-1 lg:order-2">
              <div className="relative group">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: 0,
                    x: [0, 0.5, -0.5, 0],
                    y: [0, -0.5, 0.5, 0]
                  }}
                  transition={{ 
                    scale: { duration: 1.5, ease: [0.33, 1, 0.68, 1] },
                    opacity: { duration: 1.5 },
                    rotate: { duration: 1.5 },
                    x: { duration: 0.2, repeat: Infinity },
                    y: { duration: 0.2, repeat: Infinity }
                  }}
                  className="relative z-10 aspect-square w-full max-w-[500px] mx-auto overflow-hidden rounded-[70%_30%_50%_50%/50%_30%_70%_50%] border-4 border-ink shadow-[30px_30px_0px_0px_rgba(17,17,17,0.1)] group"
                >
                  <img 
                    src="/truck.jpg" 
                    alt="Truck Cafe" 
                    className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-110 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent pointer-events-none" />
                </motion.div>

                {/* Layered Blobs behind Hero Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] bg-dust/40 blob pointer-events-none -z-10 animate-pulse border-2 border-ink/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] border-[1px] border-dashed border-ink/10 blob pointer-events-none -z-10 animate-spin-slow" />

                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  className="absolute -top-8 -right-8 p-6 bg-white border-2 border-ink rounded-2xl shadow-xl z-20 flex flex-col items-center gap-2 paper-cutout cursor-pointer"
                >
                  <CoffeeBean size={40} className="text-ink" />
                  <span className="font-hand text-xl">Pure Ink</span>
                </motion.div>

                <motion.div 
                  animate={{ x: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-12 -left-12 p-4 bg-ink text-paper rounded-full border-2 border-paper shadow-xl z-20 hover:scale-125 transition-transform"
                >
                  <CoffeeBean size={32} className="text-paper fill-paper" />
                </motion.div>

                {/* Scribbled text doodle */}
                <div className="absolute -bottom-16 right-0 font-hand text-2xl rotate-12 opacity-40 pointer-events-none">
                    Fresh from hell.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mt-24 border-t-2 border-ink pb-8 pt-12 relative z-30">
            <div className="max-w-md font-serif italic text-2xl leading-tight opacity-70">
              "We brew the chaos that wakes the dead. No filters, no corporate soul, just raw caffeinated power."
            </div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <span className="font-mono text-[10px] uppercase font-black tracking-widest group-hover:tracking-[0.5em] transition-all mb-4">Discovery</span>
                <MoveDown size={24} className="group-hover:scale-125 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee text="Caution: Explosive Energy" />

      {/* Around Us / About Section (Fluid Editorial) */}
      <section id="origin" className="relative py-32 md:py-64 px-6 md:px-12 bg-white overflow-hidden">
        <div className="absolute inset-0 noise opacity-5 pointer-events-none" />
        
        {/* Organic Background Blobs */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-dust/30 blur-[120px] blob -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-charcoal/5 blur-[100px] blob translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-12 items-center text-center mb-24">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="px-6 py-2 border-2 border-ink rounded-full font-hand text-xl rotate-[-3deg]"
            >
              Who the hell are we?
            </motion.div>
            <h2 className="font-display text-8xl md:text-[15vw] leading-[0.8] uppercase tracking-tighter">
              THE <br /> 
              <span className="italic font-serif normal-case brightness-150">Vibe</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="relative z-20 aspect-square overflow-hidden rounded-[20%_80%_30%_70%_/_60%_30%_70%_40%] thick-border bg-dust group-hover:scale-95 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" 
                  alt="Cafe Vibe" 
                  className="w-full h-full object-cover grayscale brightness-110 contrast-125 mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              
              {/* Floating Stickers */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [5, 10, 5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-12 -left-12 w-32 h-32 bg-paper thick-border rounded-full flex items-center justify-center p-4 shadow-xl z-30"
              >
                <Ghost size={48} className="text-ink" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [-10, -5, -10] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute -bottom-8 -right-8 bg-ink text-paper p-6 thick-border rounded-2xl shadow-xl z-30"
              >
                <div className="font-hand text-2xl text-center">Boring? <br/> Never.</div>
              </motion.div>

              {/* Smaller doodles */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -right-8 bg-white border-2 border-ink p-2 rounded-full z-30 shadow-md"
              >
                <Star size={24} className="fill-ink" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-1/4 bg-white border-2 border-ink p-3 blob z-30 shadow-md"
              >
                <Coffee size={24} />
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-[1px] border-dashed border-ink/20 blob pointer-events-none animate-spin-slow" />
            </div>

            <div className="space-y-12 relative">
               <div className="space-y-8">
                  <p className="font-serif text-3xl md:text-4xl leading-tight">
                    Naughty Coffee isn't just a shop. It's a <span className="font-hand text-5xl">manifesto</span> for the sleepless, the creators, and the ones who romanticize the dark corners of the city.
                  </p>
                  <p className="font-sans text-lg opacity-70 leading-relaxed max-w-lg">
                    We believe in the beauty of the breakdown. In the raw aesthetic of ink on paper and the sharp kick of a well-roasted bean. No corporate filters, no fake smiles. Just raw energy served in a cup.
                  </p>
               </div>

               <div className="flex flex-wrap gap-4">
                  {["Night Thinkers", "Shadow Artists", "Chaos Lovers", "Coffee Addicts"].map((tag, i) => (
                    <span key={i} className="px-6 py-3 bg-dust/50 border-[1px] border-ink/10 rounded-full font-mono text-[10px] uppercase font-black tracking-widest hover:bg-ink hover:text-paper transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
               </div>

               <div className="relative pt-12 border-t-[1px] border-ink/10 flex items-center gap-8 group cursor-pointer">
                  <div className="w-24 h-24 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2 border-ink flex items-center justify-center group-hover:bg-ink group-hover:text-paper transition-all duration-500">
                    <ArrowUpRight size={32} />
                  </div>
                  <div>
                    <h4 className="font-display text-2xl uppercase underline underline-offset-4">Join the coven</h4>
                    <p className="font-hand text-lg opacity-60">Wait, we meant 'the club'.</p>
                  </div>
                  
                  {/* Scribbled Arrow Decoration */}
                  <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 70C30 70 50 10 110 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                      <path d="M100 20L110 30L100 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Floating Background Icons */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-10 opacity-5 pointer-events-none"
        >
          <Skull size={200} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none"
        >
          <Ghost size={300} />
        </motion.div>
      </section>

      {/* Brew Section */}
      <section id="brew" className="py-24 md:py-48 px-6 md:px-12 bg-ink text-paper relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-10" />
        <div className="relative z-10 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b-2 border-paper/20 pb-12">
            <h2 className="font-display text-8xl md:text-[14vw] uppercase tracking-tighter leading-none italic forced-color-adjust-none ink-flicker">THE FIX</h2>
            <div className="bg-paper text-ink px-6 py-2 font-mono text-xs uppercase font-black skew-x-[-15deg] mt-6 md:mt-0">Menu Vol. 2.4</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {[
              { name: "Liquid Night", desc: "Triple shot espresso on bed of charcoal-infused milk.", price: "$6.66" },
              { name: "Ink Blot", desc: "Cold brew steeped for 24 hours in a vacuum chamber.", price: "$7.00" },
              { name: "Blackout", desc: "Straight espresso. Darker than your search history.", price: "$4.50" },
              { name: "Chaos Theory", desc: "A rotating blend of experimental roasts. High risk.", price: "$8.00" },
              { name: "Basement Latte", desc: "The original recipe. Smoky, rough, and real.", price: "$5.50" },
              { name: "Ghost Steam", desc: "Whipped white chocolate cloud over bitter black.", price: "$6.00" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 10 }}
                className="group relative border-b-[1px] border-paper/10 pb-12 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-display text-4xl uppercase tracking-tighter transition-all group-hover:italic">{item.name}</h4>
                  <span className="font-mono text-xl">{item.price}</span>
                </div>
                <p className="font-serif text-lg text-paper/60 md:max-w-[80%] leading-tight">
                  {item.desc}
                </p>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-paper transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe / Collage Section (Fluid & Artistic) */}
      <section id="vibe" className="relative py-32 md:py-64 px-6 md:px-12 overflow-hidden bg-paper">
        <div className="absolute inset-0 noise opacity-5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full scribble-texture opacity-10 pointer-events-none" />
        
        {/* Parallax Blobs */}
        <motion.div style={{ y: blobY2 }} className="absolute top-1/4 right-[-10%] w-[50vw] h-[50vw] bg-dust/30 blur-[100px] blob pointer-events-none" />
        <motion.div style={{ y: blobY1 }} className="absolute bottom-1/4 left-[-10%] w-[40vw] h-[40vw] bg-charcoal/5 blur-[120px] blob pointer-events-none border-2 border-dashed border-ink/5" />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading 
            number="02" 
            title="AESTHETIC" 
            subtitle="A sanctuary for those who appreciate the beauty in the breakdown." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">
            {/* Main Image - Organic Shape */}
            <div className="md:col-span-12 lg:col-span-7 space-y-12">
              <div className="relative group">
                <div className="aspect-[16/10] bg-dust overflow-hidden rounded-[40%_60%_70%_30%_/_30%_40%_60%_70%] border-4 border-ink shadow-2xl transition-transform duration-1000 group-hover:scale-95">
                  <img 
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop" 
                    alt="Cafe Interior" 
                    className="w-full h-full object-cover grayscale brightness-90 contrast-125 mix-blend-multiply opacity-80 transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8 p-3 bg-paper border-2 border-ink rounded-lg font-hand text-xl rotate-[-12deg] shadow-lg">Our Living Room.</div>
                </div>
                
                {/* Floating Doodle */}
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-12 -right-8 p-6 bg-white border-2 border-ink rounded-full shadow-xl"
                >
                  <Star size={48} className="fill-ink" />
                </motion.div>
              </div>

              <div className="max-w-xl p-12 paper-cutout rounded-[50%_10%_40%_20%] italic text-center mx-auto md:mx-0">
                <Coffee size={48} className="mx-auto mb-6 opacity-20" />
                <p className="font-serif text-3xl leading-snug">"It's not just coffee. It's a full sensory overload for the restless soul."</p>
                <div className="mt-8 font-hand text-2xl opacity-40">- The Ghost in the Machine</div>
              </div>
            </div>
            
            {/* Rules Card - Paper Cutout Style */}
            <div className="md:col-span-12 lg:col-span-5 space-y-12">
              <div className="relative p-12 paper-cutout rounded-[20%_80%_30%_70%] min-h-[500px] flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Skull size={300} />
                </div>
                
                <div className="relative z-10 space-y-12">
                  <div className="space-y-2">
                    <span className="font-hand text-2xl text-ink/40">Read the signs</span>
                    <h4 className="font-display text-7xl uppercase leading-none tracking-tighter">THE <br/> RULES</h4>
                  </div>
                  
                  <ul className="space-y-8">
                    {[
                      { icon: <Zap size={24} />, text: "No Decaf (Ever)." },
                      { icon: <Star size={24} />, text: "No Corporate Soul." },
                      { icon: <Ghost size={24} />, text: "Respect the Grind." },
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-6 group"
                      >
                        <div className="p-3 bg-ink text-paper rounded-full group-hover:rotate-12 transition-transform">{item.icon}</div>
                        <span className="font-serif text-3xl">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 pt-12 border-t-[1px] border-ink/10 flex justify-between items-end">
                   <Ghost size={48} className="opacity-10" />
                   <div className="font-mono text-[10px] uppercase font-black tracking-widest opacity-30">Ver. 2.4-A</div>
                </div>
              </div>

              {/* Smaller Organic Gallery items */}
              <div className="grid grid-cols-2 gap-8">
                <div className="aspect-square relative group">
                  <div className="absolute inset-0 bg-ink rounded-[70%_30%_30%_70%] group-hover:rotate-6 transition-transform duration-500" />
                  <div className="absolute inset-0 overflow-hidden border-2 border-ink rounded-[70%_30%_30%_70%] group-hover:scale-95 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=800&auto=format&fit=crop" 
                      className="w-full h-full object-cover grayscale brightness-75 contrast-150"
                      alt="Coffee Art"
                    />
                  </div>
                </div>
                
                <div className="aspect-square paper-cutout rounded-[30%_70%_70%_30%] flex items-center justify-center p-8 group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-ink scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
                  <div className="relative z-10 text-center space-y-4 group-hover:text-paper transition-colors">
                    <Star size={40} className="mx-auto opacity-20 group-hover:opacity-100 group-hover:animate-spin" />
                    <span className="font-display text-2xl uppercase tracking-tighter leading-none block">Join the <br/> Underground</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section (Fluid & Organic) */}
      <section id="contact" className="relative py-32 md:py-64 px-6 md:px-12 bg-white overflow-hidden">
        <div className="absolute inset-0 noise opacity-5 pointer-events-none" />
        <div className="absolute inset-0 scribble-texture opacity-10 pointer-events-none" />
        
        {/* Organic Blobs */}
        <div className="absolute top-1/2 left-[-10%] w-[60vw] h-[60vw] bg-dust/40 blur-[120px] blob pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-charcoal/5 blur-[100px] blob pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="flex-1 space-y-12 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-block px-6 py-2 bg-ink text-paper rounded-full font-hand text-xl rotate-[-3deg] mb-8"
              >
                Don't be a stranger.
              </motion.div>
              
              <h3 className="font-display text-[12vw] md:text-[10vw] uppercase tracking-tighter leading-[0.8] ink-bleed">
                STAY <br />
                <span className="italic font-serif normal-case brightness-75">Loose</span>
              </h3>
              
              <div className="space-y-8 pt-12">
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start opacity-90">
                   <div className="flex items-center gap-4 py-3 px-6 bg-paper paper-cutout rounded-full font-mono text-[10px] uppercase font-black tracking-widest text-ink">
                     <MapPin size={16} /> Noir District // 123
                   </div>
                   <div className="flex items-center gap-4 py-3 px-6 bg-paper paper-cutout rounded-full font-mono text-[10px] uppercase font-black tracking-widest">
                     <Zap size={16} /> 24/7 Energy
                   </div>
                </div>
                
                <p className="font-serif text-2xl italic leading-tight max-w-sm mx-auto lg:mx-0">
                  Subscribe to our secret zine for experimental roasts and late-night thoughts.
                </p>
                
                {/* Hand Drawn Decoration */}
                <div className="opacity-40 hidden lg:block">
                  <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                    <path d="M10 20C50 20 80 80 190 80M190 80L170 60M190 80L170 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl">
              <motion.div 
                initial={{ rotate: 2 }}
                whileInView={{ rotate: 0 }}
                className="relative p-1 bg-ink rounded-[40%_60%_30%_70%_/_60%_30%_70%_40%] shadow-2xl"
              >
                <div className="bg-paper p-12 md:p-20 rounded-[40%_60%_30%_70%_/_60%_30%_70%_40%] overflow-hidden relative">
                   <div className="absolute top-0 left-0 w-full h-full scribble-texture opacity-30 pointer-events-none" />
                   
                   <div className="relative z-10 space-y-12">
                     <div className="text-center space-y-2">
                       <h4 className="font-display text-5xl uppercase tracking-tighter leading-none">TRANSMISSION</h4>
                       <p className="font-hand text-xl opacity-70 italic">We don't bite. Mostly.</p>
                     </div>

                     <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
                        <div className="group border-b-2 border-ink/20 pb-6 focus-within:border-ink transition-all">
                          <label className="font-mono text-[10px] uppercase font-black opacity-60 block mb-4 tracking-[0.3em]">Identity</label>
                          <input 
                            type="text" 
                            placeholder="ALIAS" 
                            className="w-full bg-transparent p-0 text-4xl font-serif italic outline-none placeholder:text-ink/30"
                          />
                        </div>
                        <div className="group border-b-2 border-ink/20 pb-6 focus-within:border-ink transition-all">
                          <label className="font-mono text-[10px] uppercase font-black opacity-60 block mb-4 tracking-[0.3em]">Channel</label>
                          <input 
                            type="email" 
                            placeholder="EMAIL" 
                            className="w-full bg-transparent p-0 text-4xl font-serif italic outline-none placeholder:text-ink/30"
                          />
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-24 bg-ink text-paper font-display text-3xl uppercase tracking-widest rounded-2xl flex items-center justify-center gap-6 group overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-paper/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <span className="relative z-10">Send Signal</span> 
                          <ArrowRight size={32} className="relative z-10 group-hover:translate-x-4 transition-transform" />
                        </motion.button>
                     </form>
                   </div>
                </div>

                {/* Floating Stamp */}
                <motion.div 
                  animate={{ rotate: [5, 15, 5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 -right-8 w-24 h-24 bg-ink text-paper flex items-center justify-center rounded-full border-4 border-paper shadow-xl z-20 font-mono text-[10px] uppercase text-center font-black"
                >
                  Priority <br/> Ink
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area (Fluid & Organic) */}
      <footer className="relative py-24 md:py-32 px-6 md:px-12 border-t-2 border-ink bg-paper overflow-hidden">
        <div className="absolute inset-0 scribble-texture opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 right-[-5%] w-[30vw] h-[30vw] bg-dust/20 blur-[100px] blob pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-24">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-16">
            <div className="flex flex-col md:flex-row items-center gap-10 group cursor-pointer">
               <motion.div 
                 whileHover={{ scale: 1.1, rotate: -15 }}
                 className="w-32 h-32 paper-cutout rounded-[70%_30%_50%_50%] flex items-center justify-center p-4"
               >
                 <TruckLogo size={80} className="text-ink" />
               </motion.div>
               <div className="text-center md:text-left space-y-2">
                 <h5 className="font-display text-5xl uppercase tracking-tighter leading-none">NAUGHTY <br/> COFFEE</h5>
                 <p className="font-hand text-xl opacity-40 italic">Independent. Raw. Caffeinated.</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-8 items-center md:items-end w-full md:w-auto">
              <div className="flex gap-6">
                {[Instagram, Twitter, Ghost].map((Icon, i) => (
                  <motion.a 
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    href="#" 
                    className="w-20 h-20 bg-paper paper-cutout rounded-full flex items-center justify-center hover:bg-ink hover:text-paper transition-all"
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
              
              <div className="font-mono text-[10px] uppercase font-black tracking-[0.5em] opacity-30">
                Noir District // Est. 2004
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-16 border-t-[1px] border-ink/10">
            <div className="flex flex-wrap justify-center gap-10 font-mono text-[9px] uppercase font-black opacity-30 tracking-[0.3em]">
              <span className="hover:text-ink cursor-pointer transition-colors hover:italic">Privacy Protocol</span>
              <span className="hover:text-ink cursor-pointer transition-colors hover:italic">Terms of Chaos</span>
              <span className="hover:text-ink cursor-pointer transition-colors hover:italic">Bean Ethics</span>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <span className="font-mono text-[9px] uppercase font-black opacity-20">© 2024 NAUGHTY COFFEE CORP. NO REMORSE.</span>
              <div className="font-hand text-xl opacity-40 rotate-[2deg]">See you in the shadows.</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-0 z-[200] bg-ink text-paper p-12 flex flex-col justify-between"
          >
            <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
               <TruckLogo size={120} className="text-paper" />
               <button 
                 onClick={() => setIsNavOpen(false)}
                 className="p-6 border-2 border-paper hover:bg-paper hover:text-ink transition-all active:scale-90"
               >
                 <X size={40} />
               </button>
            </div>
            
            <div className="flex flex-col gap-6 relative z-10">
              <a href="#origin" onClick={() => setIsNavOpen(false)} className="font-display text-[14vw] leading-none uppercase hover:italic transition-all origin-left mb-[-2vw]">Origin</a>
              <a href="#brew" onClick={() => setIsNavOpen(false)} className="font-display text-[14vw] leading-none uppercase hover:italic transition-all origin-left mb-[-2vw]">The Fix</a>
              <a href="#vibe" onClick={() => setIsNavOpen(false)} className="font-display text-[14vw] leading-none uppercase hover:italic transition-all origin-left mb-[-2vw]">Aesthetic</a>
              <a href="#contact" onClick={() => setIsNavOpen(false)} className="font-display text-[12vw] leading-none uppercase hover:italic transition-all origin-left opacity-20 hover:opacity-100 italic transition-all">Join Us</a>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end border-t-2 border-paper/20 pt-12 font-mono text-[10px] uppercase tracking-[0.4em] relative z-10">
              <div className="flex flex-col gap-2 items-start opacity-40">
                <span>Noir District, 123</span>
                <span>Caffeine Hotline: 666-INK</span>
              </div>
              <div className="flex gap-12 mt-8 md:mt-0">
                <span className="hover:line-through cursor-pointer">Instagram</span>
                <span className="hover:line-through cursor-pointer">Twitter</span>
                <span className="hover:line-through cursor-pointer">Behance</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
