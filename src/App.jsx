import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronDown, Mail, Phone, Play, ArrowUpRight, Check } from "lucide-react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home","Portfolio","Services","About","Testimonials","Contact"];

const PORTFOLIO_ITEMS = [
  { id:1, category:"colourgrading-video", label:"Colour Grading", title:"Tairat — Music Video", tag:"COLOUR · FILM" },
  { id:2, category:"before-after", label:"Before / After", title:"DV Scene — Colour Treatment", tag:"BEFORE / AFTER", before:"/DV_BEFORE.png", after:"/DV_AFTER.png" },
  { id:3, category:"before-after", label:"Before / After", title:"Flower Scene", tag:"BEFORE / AFTER", before:"/FLOWER_BEFORE_.png", after:"/FLOWER_AFTER.png" },
  { id:4, category:"before-after", label:"Before / After", title:"Pole Scene", tag:"BEFORE / AFTER", before:"/POLE_BEFORE.png", after:"/POLE_AFTER.png" },
  { id:5, category:"before-after", label:"Before / After", title:"Zion Scene", tag:"BEFORE / AFTER", before:"/ZION_BEFORE.png", after:"/ZION_AFTER.png" },
  { id:6, category:"colourgrading-video", label:"Colour Grading", title:"Shoot — Street Scene", tag:"CINEMATIC · GRADE" },
];

const SERVICES = [
  {
    category: "Music Videos",
    items: [
      { name:"Visualizer / Studio Shoot", desc:"4–6 hrs · Single controlled setup · Basic colour grade", price:"₦70,000", detail:"1 location" },
      { name:"Concept / Narrative Video", desc:"Up to 10 hrs · 1 location · Basic concept direction · 1 revision", price:"₦120,000", detail:"1 day" },
      { name:"Full Production Video", badge:"SIGNATURE", desc:"2-day shoot · Multi-location · BTS · Colour grade · 2 revisions", price:"₦250,000", detail:"2 days" },
    ]
  },
  {
    category: "Event Videography",
    items: [
      { name:"Half Day Coverage", desc:"Up to 5 hrs · Highlight reel (2–3 min) · Basic colour", price:"₦60,000", detail:"≤5 hrs" },
      { name:"Full Day Coverage", desc:"8–10 hrs · Highlight film (3–5 min) · Standard colour · 1 camera", price:"₦100,000", detail:"8–10 hrs" },
      { name:"Multi-Camera Premium", desc:"2 operators · Dual-angle edit · Extended highlight (5–7 min)", price:"₦180,000", detail:"2 operators" },
      { name:"Extended Hours (Overtime)", desc:"Per hour beyond contracted coverage time", price:"₦10,000", detail:"per hr" },
    ]
  },
  {
    category: "Film & Commercial",
    items: [
      { name:"Personal Day Rate", desc:"Hired as videographer on someone else's production · Includes kit", price:"₦80,000", detail:"per day" },
      { name:"Commissioned Short Film", desc:"Concept, production, colour, audio mix, final delivery", price:"₦350,000+", detail:"from" },
      { name:"Brand / Commercial Film", desc:"Full brand story or product film · Concept through delivery", price:"₦500,000+", detail:"from" },
    ]
  },
];

const ADDONS = [
  { name:"Behind-The-Scenes Package", price:"+₦30,000" },
  { name:"Social Media / Vertical Cut (9:16)", price:"+₦20,000" },
  { name:"Expedited Delivery (48–72hrs)", price:"+₦25,000" },
  { name:"Drone Aerial Footage", price:"+₦40–60,000" },
  { name:"Extra Revision Round", price:"+₦15,000" },
  { name:"Raw Footage Transfer", price:"+₦30,000" },
  { name:"Premium Colour Grade", price:"+₦20–35,000" },
  { name:"Commercial Usage / Licensing", price:"+₦50–150,000" },
];

// ─── BEFORE/AFTER SLIDER ─────────────────────────────────────────────────────
function BeforeAfterSlider({ before, after, title }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPos(pct);
  };

  return (
    <div
      ref={ref}
      className="relative w-full aspect-video select-none cursor-col-resize overflow-hidden rounded-sm"
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* AFTER (base) */}
      <img src={after} alt="after" className="absolute inset-0 w-full h-full object-cover" />
      {/* BEFORE (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="before" className="absolute inset-0 w-full h-full object-cover" style={{ width: ref.current ? ref.current.offsetWidth + "px" : "100%" }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-[#C9A84C]" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg">
          <span className="text-black text-xs font-bold">↔</span>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-3 left-3 text-[10px] tracking-widest text-white/70 bg-black/50 px-2 py-1">BEFORE</span>
      <span className="absolute top-3 right-3 text-[10px] tracking-widest text-white/70 bg-black/50 px-2 py-1">AFTER</span>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="text-white font-cormorant text-xl tracking-[0.3em] font-light">
            IAMDRONES
          </button>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/60 hover:text-[#C9A84C] text-[11px] tracking-[0.2em] uppercase font-dm transition-colors duration-300">
                {link}
              </button>
            ))}
          </div>
          <button className="md:hidden text-white" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, x:"100%" }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:"100%" }}
            transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex justify-between items-center p-6">
              <span className="text-white font-cormorant text-xl tracking-[0.3em]">IAMDRONES</span>
              <button onClick={() => setOpen(false)} className="text-white"><X size={22}/></button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => scrollTo(link)}
                  className="text-white font-cormorant text-4xl tracking-widest font-light hover:text-[#C9A84C] transition-colors"
                >
                  {link}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <section id="home" className="relative h-screen flex items-end overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/IMG-20251101-WA0003.jpg"
          alt="IAMDRONES"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize:"256px",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        <motion.div
          initial={{ opacity:0, y:60 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:1.2, ease:[0.16,1,0.3,1], delay:0.3 }}
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-6">IAMDRONES · IAMCREATIVE</p>
          <h1 className="font-cormorant font-light text-white text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-tight mb-2">
            FRAME<br />
            <em className="italic text-white/80">EVERY</em><br />
            MOMENT.
          </h1>
          <p className="text-white/40 font-dm text-sm tracking-[0.3em] uppercase mt-6 mb-12">
            Videographer · Filmmaker · Colorist
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#C9A84C] text-black text-[11px] tracking-[0.3em] uppercase font-dm px-8 py-4 hover:bg-white transition-colors duration-300"
            >
              Book a Shoot
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="border border-white/20 text-white text-[11px] tracking-[0.3em] uppercase font-dm px-8 py-4 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-300 flex items-center gap-2"
            >
              View Portfolio <ArrowUpRight size={14}/>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y:[0,8,0] }}
        transition={{ repeat:Infinity, duration:2 }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-white text-[9px] tracking-[0.3em] uppercase font-dm rotate-90 mb-4">Scroll</span>
        <ChevronDown size={14} className="text-white" />
      </motion.div>
    </section>
  );
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
function Portfolio() {
  const [active, setActive] = useState("all");

  const FILTERS = [
    { key:"all", label:"All" },
    { key:"colourgrading-video", label:"Colour Grading" },
    { key:"before-after", label:"Before / After" },
  ];

  const filtered = active === "all" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.category === active);
  const beforeAfter = filtered.filter(i => i.category === "before-after");
  const videos = filtered.filter(i => i.category === "colourgrading-video");

  return (
    <section id="portfolio" className="bg-[#0a0a0a] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          className="mb-16"
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-4">02 — Portfolio</p>
          <h2 className="font-cormorant font-light text-white text-[clamp(3rem,7vw,6rem)] leading-tight">
            Selected<br /><em>Work</em>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-6 mb-12 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`text-[11px] tracking-[0.25em] uppercase font-dm transition-colors duration-300 pb-1 border-b ${active === f.key ? "text-[#C9A84C] border-[#C9A84C]" : "text-white/40 border-transparent hover:text-white"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Before/After Grid */}
        {beforeAfter.length > 0 && (
          <div className="mb-16">
            <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-dm mb-6">Colour Grading — Before / After</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beforeAfter.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity:0, y:30 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay: i * 0.1, duration:0.8 }}
                >
                  <BeforeAfterSlider before={item.before} after={item.after} title={item.title} />
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-white/60 font-dm text-sm">{item.title}</span>
                    <span className="text-[#C9A84C] text-[9px] tracking-[0.3em] uppercase">{item.tag}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Video Works */}
        {videos.length > 0 && (
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-dm mb-6">Colour Grading — Video</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity:0, y:30 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay: i * 0.1, duration:0.8 }}
                  className="group relative aspect-video bg-[#111] overflow-hidden cursor-pointer"
                >
                  {item.id === 1 ? (
                    <video
                      src="/TAIRAT_COLORING.mp4"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      muted
                      loop
                      onMouseEnter={e => e.target.play()}
                      onMouseLeave={e => { e.target.pause(); e.target.currentTime=0; }}
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full bg-[#141414] flex items-center justify-center">
                      <Play size={32} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white font-dm text-sm">{item.title}</p>
                    <p className="text-[#C9A84C] text-[9px] tracking-widest mt-1">{item.tag}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9 }}
          className="mb-16"
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-4">03 — Services</p>
          <h2 className="font-cormorant font-light text-white text-[clamp(3rem,7vw,6rem)] leading-tight">
            What I<br /><em>Offer</em>
          </h2>
        </motion.div>

        <div className="space-y-20">
          {SERVICES.map((group, gi) => (
            <div key={gi}>
              <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-dm mb-6 border-b border-white/5 pb-4">{group.category}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                {group.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity:0 }}
                    whileInView={{ opacity:1 }}
                    viewport={{ once:true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-cormorant text-white text-xl font-light leading-tight pr-4">{item.name}</h3>
                      {item.badge && (
                        <span className="text-[8px] tracking-[0.3em] bg-[#C9A84C] text-black px-2 py-1 shrink-0">{item.badge}</span>
                      )}
                    </div>
                    <p className="text-white/30 font-dm text-xs leading-relaxed mb-6">{item.desc}</p>
                    <div className="flex items-end justify-between">
                      <span className="font-cormorant text-[#C9A84C] text-2xl font-light">{item.price}</span>
                      <span className="text-white/20 font-dm text-[10px] tracking-widest">{item.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-20">
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-dm mb-6 border-b border-white/5 pb-4">Add-Ons & Upgrades</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADDONS.map((a, i) => (
              <div key={i} className="border border-white/5 p-5 hover:border-[#C9A84C]/30 transition-colors duration-300">
                <p className="text-white/70 font-dm text-xs mb-3 leading-relaxed">{a.name}</p>
                <p className="text-[#C9A84C] font-cormorant text-lg">{a.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rush terms */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ["Rush Fee (Same Week)", "+50% of base rate"],
            ["Deposit Required", "50% to confirm booking"],
            ["Payment (Balance)", "Due before delivery"],
            ["Standard Turnaround", "7–14 business days"],
            ["Travel / Remote Jobs", "Transport billed separately"],
            ["Monthly Retainer", "₦200,000–₦400,000"],
          ].map(([k,v]) => (
            <div key={k} className="py-4 border-b border-white/5">
              <p className="text-white/30 font-dm text-[10px] tracking-widest uppercase mb-1">{k}</p>
              <p className="text-white/80 font-cormorant text-lg">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="bg-[#0a0a0a] py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity:0, x:-40 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }}
          transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          className="relative"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img src="/IMG-20251101-WA0003.jpg" alt="IAMDRONES" className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="absolute -bottom-4 -right-4 border border-[#C9A84C]/30 w-full h-full pointer-events-none" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity:0, x:40 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }}
          transition={{ duration:1, ease:[0.16,1,0.3,1], delay:0.2 }}
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-6">04 — About</p>
          <h2 className="font-cormorant font-light text-white text-[clamp(2.5rem,5vw,4.5rem)] leading-tight mb-8">
            The Eye<br /><em>Behind</em><br />the Lens
          </h2>
          <p className="text-white/60 font-dm text-sm leading-[1.9] mb-6">
            IAMDRONES is a Professional Event Videographer, Filmmaker, Cinematographer, Creative Director, Colorist and Social Media Manager — with 4 years of experience crafting visuals that move people.
          </p>
          <p className="text-white/40 font-dm text-sm leading-[1.9] mb-10">
            With an eye for cinematic storytelling, I've worked alongside big brands and bold creatives — including <span className="text-white/70">5G Zaria</span>, <span className="text-white/70">Tayo Alausa Clothing Brand</span>, <span className="text-white/70">Lamba Rave with OG Abba</span> by 222 Entertainment, <span className="text-white/70">Crib & Project X with Mavin's Record Label</span>, <span className="text-white/70">Owambe Party 3.0 by Seyi of North</span>, and much more.
          </p>
          <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
            {[["4+","Years"], ["20+","Projects"], ["∞","Frames"]].map(([n,l]) => (
              <div key={l}>
                <p className="font-cormorant text-[#C9A84C] text-4xl font-light">{n}</p>
                <p className="text-white/30 font-dm text-[10px] tracking-widest uppercase mt-1">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
function Testimonials() {
  const items = [
    { name:"5G Zaria", role:"Restaurant & Bakery", quote:"The coverage was impeccable. Every detail of our event was captured with such cinematic precision. Truly a premium experience." },
    { name:"Tayo Alausa", role:"Clothing Brand", quote:"IAMDRONES brought our brand story to life in a way we never imagined. The colour grade alone made the visuals unforgettable." },
    { name:"222 Entertainment", role:"Event Production", quote:"From Lamba Rave to the final edit — professional, creative, and always delivering more than expected." },
  ];
  return (
    <section id="testimonials" className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9 }}
          className="mb-16"
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-4">05 — Testimonials</p>
          <h2 className="font-cormorant font-light text-white text-[clamp(3rem,7vw,6rem)] leading-tight">
            What They<br /><em>Say</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] p-10 hover:bg-[#0f0f0f] transition-colors"
            >
              <p className="text-[#C9A84C] font-cormorant text-5xl font-light mb-4 leading-none">"</p>
              <p className="text-white/60 font-dm text-sm leading-[1.9] mb-8">{t.quote}</p>
              <div>
                <p className="text-white font-cormorant text-lg">{t.name}</p>
                <p className="text-white/30 font-dm text-[10px] tracking-widest uppercase">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="bg-[#0a0a0a] py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9 }}
        >
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] uppercase font-dm mb-6">06 — Contact</p>
          <h2 className="font-cormorant font-light text-white text-[clamp(3rem,6vw,5.5rem)] leading-tight mb-8">
            Let's Make<br /><em>Something</em><br />Great
          </h2>
          <p className="text-white/40 font-dm text-sm leading-relaxed mb-12 max-w-sm">
            Ready to bring your vision to life? Reach out and let's start building something cinematic together.
          </p>
          <div className="space-y-6">
            {[
              { icon:<Mail size={14}/>, label:"Email", val:"lanredaniel08@gmail.com", href:"mailto:lanredaniel08@gmail.com" },
              { icon:<Phone size={14}/>, label:"WhatsApp", val:"+234 7012021648", href:"https://wa.me/2347012021648" },
              { icon:<ArrowUpRight size={14}/>, label:"Instagram & TikTok", val:"@dant.om", href:"https://instagram.com/dant.om" },
            ].map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <span className="text-[#C9A84C] group-hover:scale-110 transition-transform">{c.icon}</span>
                <div>
                  <p className="text-white/30 font-dm text-[9px] tracking-widest uppercase">{c.label}</p>
                  <p className="text-white/80 font-dm text-sm group-hover:text-[#C9A84C] transition-colors">{c.val}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9, delay:0.2 }}
          className="space-y-6"
        >
          {["Name","Email","Project Type"].map((field) => (
            <div key={field}>
              <label className="text-white/30 font-dm text-[9px] tracking-widest uppercase block mb-2">{field}</label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white/80 font-dm text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder:text-white/20"
                placeholder={field === "Project Type" ? "e.g. Music Video, Event Coverage…" : ""}
              />
            </div>
          ))}
          <div>
            <label className="text-white/30 font-dm text-[9px] tracking-widest uppercase block mb-2">Message</label>
            <textarea
              rows={4}
              className="w-full bg-transparent border-b border-white/10 py-3 text-white/80 font-dm text-sm outline-none focus:border-[#C9A84C] transition-colors resize-none"
            />
          </div>
          <button className="w-full bg-[#C9A84C] text-black font-dm text-[11px] tracking-[0.3em] uppercase py-5 hover:bg-white transition-colors duration-300 mt-4">
            Send Message
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" });
  return (
    <footer className="bg-black border-t border-white/5 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <p className="font-cormorant text-white text-2xl tracking-[0.3em] font-light mb-3">IAMDRONES</p>
            <p className="text-white/30 font-dm text-xs leading-relaxed">Every frame tells a story.<br />Let's write yours.</p>
          </div>
          <div>
            <p className="text-white/20 font-dm text-[9px] tracking-widest uppercase mb-4">Quick Links</p>
            <div className="space-y-2">
              {NAV_LINKS.map(l => (
                <button key={l} onClick={() => scrollTo(l)} className="block text-white/40 font-dm text-xs hover:text-[#C9A84C] transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/20 font-dm text-[9px] tracking-widest uppercase mb-4">Connect</p>
            <div className="space-y-2">
              <a href="https://instagram.com/dant.om" target="_blank" rel="noreferrer" className="block text-white/40 font-dm text-xs hover:text-[#C9A84C] transition-colors">Instagram — @dant.om</a>
              <a href="https://tiktok.com/@dant.om" target="_blank" rel="noreferrer" className="block text-white/40 font-dm text-xs hover:text-[#C9A84C] transition-colors">TikTok — @dant.om</a>
              <a href="mailto:lanredaniel08@gmail.com" className="block text-white/40 font-dm text-xs hover:text-[#C9A84C] transition-colors">lanredaniel08@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 font-dm text-[10px]">© {new Date().getFullYear()} IAMDRONES · IAMCREATIVE. All rights reserved.</p>
          <p className="text-white/10 font-cormorant text-sm italic">Frame Every Moment.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── LOADER ──────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      exit={{ opacity:0 }}
      transition={{ duration:0.8 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      <motion.p
        initial={{ opacity:0, letterSpacing:"0.1em" }}
        animate={{ opacity:1, letterSpacing:"0.5em" }}
        transition={{ duration:1.2, ease:"easeOut" }}
        className="font-cormorant text-white text-3xl font-light"
      >
        IAMDRONES
      </motion.p>
      <motion.div
        initial={{ scaleX:0 }}
        animate={{ scaleX:1 }}
        transition={{ duration:1.6, ease:[0.16,1,0.3,1], delay:0.3 }}
        className="w-24 h-px bg-[#C9A84C] mt-4 origin-left"
      />
    </motion.div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif" }} className="bg-black min-h-screen">
      <style>{`
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #C9A84C; }
      `}</style>

      <AnimatePresence>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}>
          <Navbar />
          <Hero />
          <Portfolio />
          <Services />
          <About />
          <Testimonials />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
