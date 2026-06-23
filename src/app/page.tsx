"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "envelope" | "ask" | "yay" | "activity" | "location" | "contact" | "sent";

// ─── Background floating dots ─────────────────────────────────────────────────
const DOTS = [
  { x: "8%",  y: "12%", size: 10, color: "#f9a8d4", dur: 5,   delay: 0 },
  { x: "92%", y: "8%",  size: 8,  color: "#fcd34d", dur: 4.5, delay: 1 },
  { x: "5%",  y: "55%", size: 12, color: "#a78bfa", dur: 6,   delay: 0.5 },
  { x: "95%", y: "45%", size: 9,  color: "#6ee7b7", dur: 5.5, delay: 1.5 },
  { x: "18%", y: "88%", size: 7,  color: "#fca5a5", dur: 4,   delay: 2 },
  { x: "78%", y: "82%", size: 11, color: "#93c5fd", dur: 6.5, delay: 0.8 },
  { x: "50%", y: "5%",  size: 6,  color: "#f9a8d4", dur: 5,   delay: 1.2 },
  { x: "35%", y: "92%", size: 8,  color: "#fcd34d", dur: 4.8, delay: 0.3 },
  { x: "85%", y: "25%", size: 10, color: "#a78bfa", dur: 5.2, delay: 1.8 },
  { x: "12%", y: "38%", size: 7,  color: "#6ee7b7", dur: 4.2, delay: 0.7 },
];

function FloatingDots() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {DOTS.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full float-dot"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: d.color,
            "--duration": `${d.dur}s`,
            "--delay": `${d.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#f9a8d4", "#fcd34d", "#a78bfa", "#6ee7b7", "#fca5a5", "#93c5fd", "#fb923c"];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    dur: 2 + Math.random() * 2,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            "--fall-duration": `${p.dur}s`,
            "--fall-delay": `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`bg-white rounded-3xl shadow-xl px-8 py-10 w-full max-w-sm mx-auto text-center ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Icon circle ──────────────────────────────────────────────────────────────
function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-5 text-2xl">
      {children}
    </div>
  );
}

// ─── Step 0: Envelope ─────────────────────────────────────────────────────────
function EnvelopeStep({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onOpen, 700);
  };

  return (
    <Card>
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={opened ? { scale: [1, 1.2, 0.8], rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="text-8xl select-none"
        >
          {opened ? "📬" : "✉️"}
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-pink-500 mb-2">You&apos;ve got a letter!</h1>
          <p className="text-gray-400 text-sm">Someone sent you something special 💜</p>
        </div>
        <motion.button
          onClick={handleOpen}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          disabled={opened}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-lg disabled:opacity-60 transition-all"
        >
          {opened ? "Opening... 💫" : "Open the envelope ✨"}
        </motion.button>
      </motion.div>
    </Card>
  );
}

// ─── Step 1: Ask ──────────────────────────────────────────────────────────────
const NO_MESSAGES = [
  "Think again!",
  "You might regret this!",
  "Are you sure??",
  "Last chance!",
  "Really?? 😭",
];

const TEASE_MESSAGES = [
  "",
  "Hey, stop playing hard to get! 😏",
  "Okay, now you're just teasing me 😅",
  "You can't escape! 😂",
  "Fine... I'll find you 😤",
];

function AskStep({ onYes }: { onYes: () => void }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const moveNo = useCallback(() => {
    const count = noCount + 1;
    setNoCount(count);
    setYesScale((s) => Math.min(s + 0.15, 2));

    if (count >= 8 && yesRef.current && noRef.current) {
      // Slide No directly behind Yes using real DOM positions
      const yr = yesRef.current.getBoundingClientRect();
      const nr = noRef.current.getBoundingClientRect();
      setNoPos((prev) => ({
        x: prev.x + (yr.left + yr.width / 2 - (nr.left + nr.width / 2)),
        y: prev.y + (yr.top + yr.height / 2 - (nr.top + nr.height / 2)),
      }));
    } else {
      const range = 80 + count * 8;
      setNoPos({
        x: (Math.random() - 0.5) * range,
        y: (Math.random() - 0.5) * range * 0.5,
      });
    }
  }, [noCount]);

  const noLabel = NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)] ?? "Nope!";
  const teaseMsg = TEASE_MESSAGES[Math.min(noCount, TEASE_MESSAGES.length - 1)];
  const hiddenBehindYes = noCount >= 8;

  return (
    <Card>
      <IconCircle>🤝</IconCircle>
      <h1 className="text-2xl font-black text-pink-500 mb-2">Would you like to go out with me?</h1>
      <p className="text-gray-400 text-sm mb-10">I promise to be a really good one 🤝</p>

      <div className="relative flex items-center justify-center gap-4 h-16">
        {/* No first in DOM so Yes (rendered after) naturally paints on top */}
        <motion.button
          ref={noRef}
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          onMouseEnter={hiddenBehindYes ? undefined : moveNo}
          onTouchStart={hiddenBehindYes ? undefined : moveNo}
          className="px-7 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-400 font-bold text-lg shadow-md transition-colors"
        >
          {noLabel}
        </motion.button>

        {/* Yes — rendered after No so it paints on top */}
        <motion.button
          ref={yesRef}
          onClick={onYes}
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="px-7 py-3 rounded-full bg-green-400 hover:bg-green-500 text-white font-bold text-lg shadow-md transition-colors flex items-center gap-2"
        >
          Yes 🎉
        </motion.button>
      </div>

      {teaseMsg && (
        <motion.p
          key={teaseMsg}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400 text-sm mt-12 italic"
        >
          {teaseMsg}
        </motion.p>
      )}
    </Card>
  );
}

// ─── Step 2: Yay ──────────────────────────────────────────────────────────────
function YayStep({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2800);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <>
      <Confetti />
      <Card>
        <div className="flex justify-center gap-3 text-4xl mb-4">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}>🎉</motion.span>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: "spring" }}>🥳</motion.span>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>✨</motion.span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-pink-500 mb-3"
        >
          YAAAAY!!!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-base"
        >
          You just made me the happiest person alive!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-pink-400 font-bold text-base mt-1"
        >
          This will be fun! 🎉✨🥳🎊💃
        </motion.p>
      </Card>
    </>
  );
}

// ─── Step 3: Activity ─────────────────────────────────────────────────────────
const ACTIVITIES = [
  { icon: "☕", label: "Coffee & Chat" },
  { icon: "🎬", label: "Movie Night" },
  { icon: "🍕", label: "Dinner Hangout" },
  { icon: "🎆", label: "Fireshow" },
  { icon: "🌿", label: "Nature Walk" },
  { icon: "🎮", label: "Gaming Session" },
];

function ActivityStep({ onNext }: { onNext: (val: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card>
      <IconCircle>📅</IconCircle>
      <h1 className="text-2xl font-black text-gray-800 mb-1">What kind of hangout?</h1>
      <p className="text-gray-400 text-sm mb-6">Pick something you&apos;d enjoy!</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {ACTIVITIES.map((a) => (
          <button
            key={a.label}
            onClick={() => setSelected(a.label)}
            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
              selected === a.label
                ? "border-pink-400 bg-pink-50 text-pink-600"
                : "border-gray-100 bg-gray-50 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
            }`}
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-4 rounded-2xl bg-pink-400 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-colors"
      >
        Next →
      </button>
    </Card>
  );
}

// ─── Step 4: Location ─────────────────────────────────────────────────────────
const LOCATIONS = [
  { icon: "📍", label: "Your favorite spot" },
  { icon: "✨", label: "My favorite spot" },
  { icon: "🎲", label: "Surprise me!" },
  { icon: "🤝", label: "We'll decide together" },
];

function LocationStep({ onNext }: { onNext: (val: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card>
      <IconCircle>📍</IconCircle>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Where should we go?</h1>
      <p className="text-gray-400 text-sm mb-6">Let&apos;s pick the perfect spot!</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {LOCATIONS.map((l) => (
          <button
            key={l.label}
            onClick={() => setSelected(l.label)}
            className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all font-semibold text-sm ${
              selected === l.label
                ? "border-pink-400 bg-pink-50 text-pink-600"
                : "border-gray-100 bg-gray-50 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
            }`}
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="leading-tight text-center">{l.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-4 rounded-2xl bg-pink-400 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-colors"
      >
        Next →
      </button>
    </Card>
  );
}

// ─── Step 5: Contact ──────────────────────────────────────────────────────────
function ContactStep({ onNext }: { onNext: (val: string) => void }) {
  const [contact, setContact] = useState("");

  return (
    <Card>
      <IconCircle>💬</IconCircle>
      <h1 className="text-2xl font-black text-gray-800 mb-1">How can I reach you?</h1>
      <p className="text-gray-400 text-sm mb-6">Share your phone number or social media!</p>

      <input
        type="text"
        placeholder="Phone, Instagram, etc..."
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full border-2 border-gray-200 focus:border-pink-400 rounded-2xl px-4 py-3 text-gray-700 outline-none transition-colors text-sm mb-4"
        onKeyDown={(e) => e.key === "Enter" && contact.trim() && onNext(contact)}
      />

      <button
        onClick={() => contact.trim() && onNext(contact)}
        disabled={!contact.trim()}
        className="w-full py-4 rounded-2xl bg-pink-400 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
      >
        Send 🤙
      </button>
    </Card>
  );
}

// ─── Step 6: Sent ─────────────────────────────────────────────────────────────
function SentStep({ activity, location }: { activity: string; location: string }) {
  return (
    <>
      <Confetti />
      <Card>
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-pink-500 mb-2">It&apos;s a plan!</h1>
        <p className="text-gray-500 text-sm mb-6">Can&apos;t wait to hang out with you!</p>

        <div className="bg-pink-50 rounded-2xl p-4 text-left space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📅</span>
            <span className="font-semibold">{activity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span className="font-semibold">{location}</span>
          </div>
        </div>

        <p className="text-pink-400 font-bold text-base">I&apos;ll reach out soon! 💜</p>
      </Card>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<Step>("envelope");
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
      <FloatingDots />

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === "envelope" && (
            <motion.div key="envelope">
              <EnvelopeStep onOpen={() => setStep("ask")} />
            </motion.div>
          )}

          {step === "ask" && (
            <motion.div key="ask">
              <AskStep onYes={() => setStep("yay")} />
            </motion.div>
          )}

          {step === "yay" && (
            <motion.div key="yay">
              <YayStep onNext={() => setStep("activity")} />
            </motion.div>
          )}

          {step === "activity" && (
            <motion.div key="activity">
              <ActivityStep
                onNext={(val) => {
                  setActivity(val);
                  setStep("location");
                }}
              />
            </motion.div>
          )}

          {step === "location" && (
            <motion.div key="location">
              <LocationStep
                onNext={(val) => {
                  setLocation(val);
                  setStep("contact");
                }}
              />
            </motion.div>
          )}

          {step === "contact" && (
            <motion.div key="contact">
              <ContactStep onNext={() => setStep("sent")} />
            </motion.div>
          )}

          {step === "sent" && (
            <motion.div key="sent">
              <SentStep activity={activity} location={location} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
