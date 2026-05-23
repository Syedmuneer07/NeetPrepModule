import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, RadarChart, Radar, PolarGrid,
  PolarAngleAxis
} from "recharts";

// ═══════════════════════════════════════════════════════════
//  EXACT 30-DAY TIMETABLE DATA
// ═══════════════════════════════════════════════════════════
const TIMETABLE = [
  // WEEK 1
  { day:1,  week:1, phase:"learn", bio:"Cell Unit + Biomolecules",             chem:"Mole Concept",             phy:"Semiconductors",              target:"350 MCQs" },
  { day:2,  week:1, phase:"learn", bio:"Cell Cycle + Division",                chem:"Atomic Structure",         phy:"Current Electricity",         target:"350 MCQs" },
  { day:3,  week:1, phase:"learn", bio:"Diversity Living World",               chem:"Chemical Bonding",         phy:"Kinematics",                  target:"350 MCQs" },
  { day:4,  week:1, phase:"learn", bio:"Plant Kingdom + Animal Kingdom",       chem:"Thermodynamics",           phy:"Ray Optics",                  target:"350 MCQs" },
  { day:5,  week:1, phase:"learn", bio:"Morphology + Anatomy Plants",          chem:"Equilibrium",              phy:"Moving Charges & Magnetism",   target:"350 MCQs" },
  { day:6,  week:1, phase:"learn", bio:"Structural Organisation Animals",      chem:"Electrochemistry",         phy:"Electric Potential & Capacitance", target:"350 MCQs" },
  { day:7,  week:1, phase:"mock",  bio:"Week 1 Full Biology Revision",         chem:"Week 1 Chemistry Revision",phy:"Week 1 Physics Revision",     target:"Full Mock + Analysis" },
  // WEEK 2
  { day:8,  week:2, phase:"learn", bio:"Photosynthesis",                       chem:"Chemical Kinetics",        phy:"Gravitation",                 target:"350 MCQs" },
  { day:9,  week:2, phase:"learn", bio:"Respiration Plants",                   chem:"Periodicity",              phy:"Rotational Mechanics",        target:"350 MCQs" },
  { day:10, week:2, phase:"learn", bio:"Plant Growth",                         chem:"p-Block",                  phy:"Dual Nature",                 target:"350 MCQs" },
  { day:11, week:2, phase:"learn", bio:"Breathing + Circulation",              chem:"d/f Block",                phy:"Units & Dimensions",          target:"350 MCQs" },
  { day:12, week:2, phase:"learn", bio:"Excretion + Movement",                 chem:"Coordination Compounds",   phy:"Work, Energy & Power",        target:"350 MCQs" },
  { day:13, week:2, phase:"learn", bio:"Neural + Chemical Coordination",       chem:"GOC",                      phy:"Wave Optics",                 target:"350 MCQs" },
  { day:14, week:2, phase:"mock",  bio:"Full Week Revision",                   chem:"Organic Quick Revision",   phy:"Mixed Physics PYQs",          target:"Full Mock" },
  // WEEK 3
  { day:15, week:3, phase:"learn", bio:"Sexual Reproduction Plants",           chem:"Hydrocarbons",             phy:"EMI",                         target:"350 MCQs" },
  { day:16, week:3, phase:"learn", bio:"Human Reproduction",                   chem:"Halogens",                 phy:"Laws of Motion",              target:"350 MCQs" },
  { day:17, week:3, phase:"learn", bio:"Reproductive Health",                  chem:"Oxygen Compounds",         phy:"SHM",                         target:"350 MCQs" },
  { day:18, week:3, phase:"learn", bio:"Genetics",                             chem:"Nitrogen Compounds",       phy:"Alternating Current",         target:"350 MCQs" },
  { day:19, week:3, phase:"learn", bio:"Molecular Basis + Evolution",          chem:"Biomolecules",             phy:"Full Modern Physics Revision", target:"350 MCQs" },
  { day:20, week:3, phase:"mock",  bio:"Ecology + Biotechnology + Human Welfare", chem:"Practical Chemistry",  phy:"Full Physics Formula Revision",target:"Full Mock" },
  // WEEK 4 — Final Revision Phase
  { day:21, week:4, phase:"final", morning:"Human Physiology Revision",  afternoon:"Full Mock",         evening:"Analysis",         night:"Formula Revision",    target:"Full Mock" },
  { day:22, week:4, phase:"final", morning:"Genetics Revision",           afternoon:"Full Mock",         evening:"Error Fix",        night:"NCERT Reading",       target:"Full Mock" },
  { day:23, week:4, phase:"final", morning:"Ecology + Biotechnology",     afternoon:"Full Mock",         evening:"PYQ Review",       night:"Organic Reactions",   target:"Full Mock" },
  { day:24, week:4, phase:"final", morning:"Cell Biology Revision",       afternoon:"Full Mock",         evening:"Weak Topics",      night:"Physics Formula Sheet",target:"Full Mock" },
  { day:25, week:4, phase:"final", morning:"Reproduction Revision",       afternoon:"Full Mock",         evening:"Mistake Notebook", night:"Inorganic NCERT",     target:"Full Mock" },
  { day:26, week:4, phase:"final", morning:"Full Organic Chemistry",      afternoon:"Full Mock",         evening:"PYQs",             night:"Named Reactions",     target:"Full Mock" },
  { day:27, week:4, phase:"final", morning:"Full Physical Chemistry",     afternoon:"Full Mock",         evening:"Numericals",       night:"Formula Recall",      target:"Full Mock" },
  { day:28, week:4, phase:"final", morning:"Full Inorganic Chemistry",    afternoon:"Full Mock",         evening:"NCERT Revision",   night:"Light Revision",      target:"Full Mock" },
  { day:29, week:4, phase:"final", morning:"Full Physics Revision",       afternoon:"Final Grand Mock",  evening:"Deep Analysis",    night:"Sleep Early 🌙",      target:"Grand Mock" },
  { day:30, week:4, phase:"final", morning:"Light NCERT + Formula Recall",afternoon:"Relaxed PYQs",     evening:"Confidence Building 💪",night:"Early Sleep 🌙",  target:"Rest & Confidence" },
];

// Build sessions from timetable
function buildSchedule() {
  return TIMETABLE.map(d => {
    if (d.phase === "final") {
      return {
        ...d,
        sessions: [
          { id:`${d.day}-1`, label:`🌅 Morning: ${d.morning}`,     subject:"Biology",   hours:3,   mcqs:100, priority:"High",   done:false, tag:"Revision" },
          { id:`${d.day}-2`, label:`☀️ Afternoon: ${d.afternoon}`, subject:"Physics",   hours:3,   mcqs:180, priority:"High",   done:false, tag:"Mock" },
          { id:`${d.day}-3`, label:`🌆 Evening: ${d.evening}`,     subject:"Chemistry", hours:1.5, mcqs:50,  priority:"High",   done:false, tag:"Analysis" },
          { id:`${d.day}-4`, label:`🌙 Night: ${d.night}`,         subject:"Biology",   hours:1,   mcqs:0,   priority:"Medium", done:false, tag:"Night" },
        ],
      };
    }
    if (d.phase === "mock") {
      return {
        ...d,
        sessions: [
          { id:`${d.day}-1`, label:`🧬 Bio Revision: ${d.bio}`,   subject:"Biology",   hours:2, mcqs:90,  priority:"High", done:false, tag:"Revision" },
          { id:`${d.day}-2`, label:`⚗️ Chem Revision: ${d.chem}`,  subject:"Chemistry", hours:2, mcqs:90,  priority:"High", done:false, tag:"Revision" },
          { id:`${d.day}-3`, label:`⚛️ Phy Revision: ${d.phy}`,    subject:"Physics",   hours:2, mcqs:90,  priority:"High", done:false, tag:"Revision" },
          { id:`${d.day}-4`, label:"📝 Full Mock Test (3hrs)",      subject:"Biology",   hours:3, mcqs:180, priority:"High", done:false, tag:"Mock" },
          { id:`${d.day}-5`, label:"🔍 Mock Analysis",              subject:"Chemistry", hours:1.5,mcqs:0,  priority:"High", done:false, tag:"Analysis" },
        ],
      };
    }
    // Learn day
    return {
      ...d,
      sessions: [
        { id:`${d.day}-1`, label:`🌅 Morning Bio: ${d.bio}`,       subject:"Biology",   hours:2.5, mcqs:120, priority:"High",   done:false, tag:"Chapter" },
        { id:`${d.day}-2`, label:`☀️ Afternoon Phy: ${d.phy}`,     subject:"Physics",   hours:2,   mcqs:100, priority:"High",   done:false, tag:"Chapter" },
        { id:`${d.day}-3`, label:`🌆 Evening Chem: ${d.chem}`,     subject:"Chemistry", hours:1.5, mcqs:80,  priority:"Medium", done:false, tag:"Chapter" },
        { id:`${d.day}-4`, label:"🌙 Night Formula Revision",       subject:"Chemistry", hours:0.5, mcqs:0,   priority:"Medium", done:false, tag:"Formula" },
        { id:`${d.day}-5`, label:"📔 Error Notebook Review",        subject:"Biology",   hours:0.5, mcqs:30,  priority:"Low",    done:false, tag:"Review" },
        { id:`${d.day}-6`, label:"⚡ PYQ Sprint (50 MCQs)",         subject:"Physics",   hours:1,   mcqs:50,  priority:"High",   done:false, tag:"PYQ" },
      ],
    };
  });
}

const INIT_SCHEDULE = buildSchedule();
const STORAGE_KEY = "neet_war_room_data";
const LEGACY_SCHEDULE_KEY = "neet_v3_schedule";

const NEET_DATE = new Date("2026-06-21T08:00:00");

const QUOTES = [
  "Every MCQ you solve is a brick in your MBBS palace. 🏛️",
  "The pain of studying is less than the pain of regret. 🔥",
  "5:30 AM — while others sleep, you rise. 🌅",
  "NEET 2026 is yours. Keep your head down and grind.",
  "Revision is not repetition — it's reinforcement. 💪",
  "Your rank is being decided right now, this very moment.",
  "Hard days build strong doctors. Stay in the arena.",
  "Biology, Physics, Chemistry — master all three. No excuses.",
];

const SUB = {
  Biology:   { color:"#22c55e", neon:"#4ade80", glow:"rgba(34,197,94,0.15)",  icon:"🧬", badge:"bg-green-500/15 text-green-400 border border-green-500/25" },
  Physics:   { color:"#3b82f6", neon:"#60a5fa", glow:"rgba(59,130,246,0.15)", icon:"⚛️", badge:"bg-blue-500/15 text-blue-400 border border-blue-500/25" },
  Chemistry: { color:"#f59e0b", neon:"#fbbf24", glow:"rgba(245,158,11,0.15)", icon:"⚗️", badge:"bg-amber-500/15 text-amber-400 border border-amber-500/25" },
};

// ═══════════════════════════════════════════════════════════
//  HOOKS
// ═══════════════════════════════════════════════════════════
function createStoredData(schedule = INIT_SCHEDULE) {
  return {
    schedule,
    updatedAt: new Date().toISOString(),
  };
}

function readStoredData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.schedule)) return parsed;
    }

    const legacySchedule = localStorage.getItem(LEGACY_SCHEDULE_KEY);
    if (legacySchedule) {
      const parsedLegacySchedule = JSON.parse(legacySchedule);
      if (Array.isArray(parsedLegacySchedule)) {
        const migratedData = createStoredData(parsedLegacySchedule);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
        localStorage.removeItem(LEGACY_SCHEDULE_KEY);
        return migratedData;
      }
    }
  } catch {}

  return createStoredData();
}

function useStoredSchedule() {
  const [data, setData] = useState(readStoredData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const setSchedule = useCallback(update => {
    setData(prev => {
      const nextSchedule = typeof update === "function" ? update(prev.schedule) : update;
      return createStoredData(nextSchedule);
    });
  }, []);

  return [data.schedule, setSchedule];
}

function useCountdown() {
  const [diff, setDiff] = useState(NEET_DATE - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(NEET_DATE - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, diff);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    mins: Math.floor((d % 3600000) / 60000),
    secs: Math.floor((d % 60000) / 1000),
  };
}

// ═══════════════════════════════════════════════════════════
//  POMODORO
// ═══════════════════════════════════════════════════════════
function PomodoroTimer() {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("work");
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s > 0) return s - 1;
        setMins(m => {
          if (m > 0) { setSecs(59); return m - 1; }
          clearInterval(ref.current); setRunning(false);
          if (phase === "work") { setCount(n=>n+1); setPhase("break"); setMins(5); setSecs(0); }
          else { setPhase("work"); setMins(25); setSecs(0); }
          return 0;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, phase]);

  const reset = () => { clearInterval(ref.current); setRunning(false); setMins(25); setSecs(0); setPhase("work"); };
  const total = phase === "work" ? 1500 : 300;
  const pct = ((total - (mins*60+secs)) / total) * 100;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="glass-card p-6 flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full">
        <p className="label-xs">Pomodoro Timer</p>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${phase==="work"?"bg-blue-500/20 text-blue-400":"bg-green-500/20 text-green-400"}`}>
          {phase === "work" ? "FOCUS" : "BREAK"}
        </span>
      </div>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
          <circle cx="60" cy="60" r="52" fill="none"
            stroke={phase==="work"?"#3b82f6":"#22c55e"} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference*(1-pct/100)}
            style={{transition:"stroke-dashoffset 1s linear", filter:`drop-shadow(0 0 6px ${phase==="work"?"#3b82f6":"#22c55e"})`}}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums tracking-tight">
            {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
          </span>
          <span className="text-[10px] opacity-40 mt-1">{count} sessions done</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={()=>setRunning(r=>!r)} className={`btn-pill ${running?"bg-red-500/20 text-red-400 border-red-500/30":"bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={reset} className="btn-pill bg-white/5 text-white/50 border-white/10">↺ Reset</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SESSION ROW
// ═══════════════════════════════════════════════════════════
function SessionRow({ session, onToggle }) {
  const s = SUB[session.subject] || SUB.Biology;
  const tagColors = {
    Mock:"bg-purple-500/20 text-purple-300", PYQ:"bg-cyan-500/20 text-cyan-300",
    Formula:"bg-yellow-500/20 text-yellow-300", Analysis:"bg-orange-500/20 text-orange-300",
    Chapter:"bg-indigo-500/20 text-indigo-300", Revision:"bg-teal-500/20 text-teal-300",
    Review:"bg-rose-500/20 text-rose-300", Night:"bg-slate-500/20 text-slate-300",
  };
  return (
    <motion.div layout
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${
        session.done
          ? "bg-green-500/5 border-green-500/15 opacity-55"
          : "bg-white/[0.03] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.05]"
      }`}>
      <button onClick={()=>onToggle(session.id)}
        className={`w-5 h-5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          session.done ? "border-green-500 bg-green-500" : "border-white/25 hover:border-green-400 hover:shadow-[0_0_8px_rgba(74,222,128,0.4)]"
        }`}>
        {session.done && <span className="text-white text-[10px] font-black">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-tight ${session.done?"line-through opacity-40":""}`}>{session.label}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.badge}`}>{session.subject}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${tagColors[session.tag]||"bg-white/10 text-white/40"}`}>{session.tag}</span>
          <span className="text-[10px] opacity-30">{session.hours}h</span>
          {session.mcqs>0 && <span className="text-[10px] opacity-30">{session.mcqs} MCQs</span>}
        </div>
      </div>
      <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
        session.priority==="High"?"bg-red-500":session.priority==="Medium"?"bg-amber-500":"bg-green-500"
      }`} style={session.priority==="High"?{boxShadow:"0 0 6px #ef4444"}:{}}/>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  DAY CARD  (Week 1–3)
// ═══════════════════════════════════════════════════════════
function DayCard({ dayData, onToggle, isToday, isExpanded, onClick }) {
  const done = dayData.sessions.filter(s=>s.done).length;
  const total = dayData.sessions.length;
  const pct = total ? Math.round((done/total)*100) : 0;
  const isMock = dayData.phase==="mock";

  const accentBorder = isToday
    ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
    : isMock
    ? "border-purple-500/40 shadow-[0_0_16px_rgba(168,85,247,0.08)]"
    : pct===100
    ? "border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.06)]"
    : "border-white/[0.07] hover:border-white/[0.14]";

  return (
    <motion.div layout className={`rounded-2xl border overflow-hidden transition-all duration-300 bg-[#0d1021] ${accentBorder}`}>
      <button onClick={onClick} className="w-full p-4 text-left flex items-center gap-4 hover:bg-white/[0.03] transition-colors">
        {/* Day number badge */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all ${
          isToday ? "bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]"
          : isMock ? "bg-purple-500 text-white shadow-[0_0_16px_rgba(168,85,247,0.5)]"
          : pct===100 ? "bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]"
          : "bg-white/[0.07] text-white/50"
        }`}>{dayData.day}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Subjects inline */}
            {dayData.phase !== "final" && (
              <div className="flex gap-1.5 items-center flex-wrap">
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">🧬 {dayData.bio?.split(" ")[0]}…</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">⚗️ {dayData.chem?.split(" ")[0]}…</span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">⚛️ {dayData.phy?.split(" ")[0]}…</span>
              </div>
            )}
            {dayData.phase === "final" && (
              <span className="text-[11px] font-semibold opacity-60 truncate max-w-[200px]">🌅 {dayData.morning}</span>
            )}
            {isToday && <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black tracking-wider">TODAY</span>}
            {isMock && <span className="text-[9px] bg-purple-500/80 text-white px-2 py-0.5 rounded-full font-black tracking-wider">MOCK DAY</span>}
            {dayData.phase==="final" && <span className="text-[9px] bg-rose-500/80 text-white px-2 py-0.5 rounded-full font-black tracking-wider">FINAL PHASE</span>}
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 flex-1 bg-white/[0.07] rounded-full overflow-hidden max-w-40">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${pct}%`, background: pct===100?"#22c55e":isToday?"#3b82f6":isMock?"#a855f7":"#3b82f6",
                  boxShadow: pct===100?"0 0 6px #22c55e":isToday?"0 0 6px #3b82f6":"none" }} />
            </div>
            <span className="text-[10px] opacity-35 tabular-nums">{pct}%</span>
            <span className="text-[10px] opacity-25">{done}/{total}</span>
            <span className="text-[10px] opacity-25">{dayData.target}</span>
          </div>
        </div>
        <span className={`text-white/20 text-sm transition-transform duration-300 flex-shrink-0 ${isExpanded?"rotate-180":""}`}>▾</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.22}}>
            <div className="px-4 pb-4 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
              {dayData.sessions.map(s => <SessionRow key={s.id} session={s} onToggle={onToggle}/>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  WEEK GROUP
// ═══════════════════════════════════════════════════════════
function WeekGroup({ weekNum, days, schedule, onToggle, expandedDay, setExpandedDay, today }) {
  const labels = {1:"Week 1 — Foundation Attack",2:"Week 2 — Deep Dive",3:"Week 3 — Reproduction & Organic",4:"Week 4 — Final War Phase 🔥"};
  const allSessions = days.flatMap(d=>d.sessions);
  const donePct = allSessions.length ? Math.round(allSessions.filter(s=>s.done).length/allSessions.length*100) : 0;
  const weekColors = {1:"#3b82f6",2:"#a855f7",3:"#f59e0b",4:"#ef4444"};
  const wc = weekColors[weekNum];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-white/[0.07]"/>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest" style={{color:wc}}>{labels[weekNum]}</span>
          <span className="text-[10px] opacity-30">{donePct}% done</span>
        </div>
        <div className="h-px flex-1 bg-white/[0.07]"/>
      </div>
      <div className="flex flex-col gap-2">
        {days.map(d=>(
          <DayCard key={d.day} dayData={d} onToggle={onToggle}
            isToday={d.day===today} isExpanded={expandedDay===d.day}
            onClick={()=>setExpandedDay(p=>p===d.day?null:d.day)}/>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  TIMETABLE VIEW (visual table)
// ═══════════════════════════════════════════════════════════
function TimetableView({ schedule }) {
  const [activeWeek, setActiveWeek] = useState(1);
  const weeks = [1,2,3,4];
  const weekDays = schedule.filter(d=>d.week===activeWeek);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {weeks.map(w=>(
          <button key={w} onClick={()=>setActiveWeek(w)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeWeek===w
                ?"bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.4)]"
                :"bg-white/[0.05] text-white/40 hover:bg-white/10"
            }`}>
            Week {w}
          </button>
        ))}
      </div>

      {activeWeek < 4 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-3 text-white/30 font-semibold uppercase tracking-wider w-16">Day</th>
                <th className="text-left p-3 font-semibold uppercase tracking-wider w-1/3" style={{color:"#4ade80"}}>🧬 Biology</th>
                <th className="text-left p-3 font-semibold uppercase tracking-wider w-1/3" style={{color:"#fbbf24"}}>⚗️ Chemistry</th>
                <th className="text-left p-3 font-semibold uppercase tracking-wider w-1/3" style={{color:"#60a5fa"}}>⚛️ Physics</th>
                <th className="text-right p-3 text-white/30 font-semibold uppercase tracking-wider">Target</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map((d,i)=>{
                const isMock = d.phase==="mock";
                const sessions = schedule[d.day-1]?.sessions||[];
                const donePct = sessions.length?Math.round(sessions.filter(s=>s.done).length/sessions.length*100):0;
                return (
                  <tr key={d.day}
                    className={`border-t border-white/[0.05] transition-colors ${isMock?"bg-purple-500/5":"hover:bg-white/[0.02]"}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          isMock?"bg-purple-500/20 text-purple-400":donePct===100?"bg-green-500/20 text-green-400":"bg-white/[0.07] text-white/40"
                        }`}>{d.day}</div>
                        <div className="h-6 w-1 bg-white/[0.07] rounded-full overflow-hidden">
                          <div className="w-full rounded-full transition-all" style={{height:`${donePct}%`,background:donePct===100?"#22c55e":"#3b82f6",marginTop:`${100-donePct}%`}}/>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-green-400/80 font-medium leading-tight block">{d.bio}</span>
                      {isMock&&<span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded mt-1 inline-block">MOCK</span>}
                    </td>
                    <td className="p-3 text-amber-400/80 font-medium">{d.chem}</td>
                    <td className="p-3 text-blue-400/80 font-medium">{d.phy}</td>
                    <td className="p-3 text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
                        d.target==="350 MCQs"?"bg-green-500/15 text-green-400":"bg-purple-500/15 text-purple-400"
                      }`}>{d.target}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Week 4 special layout */
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-3 text-white/30 font-semibold uppercase tracking-wider w-16">Day</th>
                <th className="text-left p-3 text-white/50 font-semibold uppercase tracking-wider">🌅 Morning</th>
                <th className="text-left p-3 text-white/50 font-semibold uppercase tracking-wider">☀️ Afternoon</th>
                <th className="text-left p-3 text-white/50 font-semibold uppercase tracking-wider">🌆 Evening</th>
                <th className="text-left p-3 text-white/50 font-semibold uppercase tracking-wider">🌙 Night</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map(d=>{
                const sessions=schedule[d.day-1]?.sessions||[];
                const donePct=sessions.length?Math.round(sessions.filter(s=>s.done).length/sessions.length*100):0;
                return (
                  <tr key={d.day} className="border-t border-white/[0.05] hover:bg-rose-500/[0.02]">
                    <td className="p-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        donePct===100?"bg-green-500/20 text-green-400":"bg-rose-500/15 text-rose-400"
                      }`}>{d.day}</div>
                    </td>
                    <td className="p-3 text-white/60 font-medium">{d.morning}</td>
                    <td className="p-3 text-purple-400/80 font-semibold">{d.afternoon}</td>
                    <td className="p-3 text-amber-400/70">{d.evening}</td>
                    <td className="p-3 text-slate-400/70">{d.night}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">⚡ Final Phase Rules</p>
            <p className="text-xs text-white/40 leading-relaxed">No new learning · NCERT revision only · Formula revision · PYQs · Mock analysis · Mistake notebook · High-yield chapters</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════
function Analytics({ schedule }) {
  const subjectData = Object.keys(SUB).map(sub=>{
    const tasks = schedule.flatMap(d=>d.sessions.filter(s=>s.subject===sub));
    const done = tasks.filter(t=>t.done).length;
    return { subject:sub, done, total:tasks.length, pct:tasks.length?Math.round(done/tasks.length*100):0 };
  });
  const weeklyData = [1,2,3,4].map(w=>{
    const days = schedule.filter(d=>d.week===w);
    const tasks = days.flatMap(d=>d.sessions);
    const done = tasks.filter(t=>t.done).length;
    const mcqs = tasks.filter(t=>t.done).reduce((a,s)=>a+s.mcqs,0);
    return { week:`W${w}`, tasks:done, mcqs };
  });
  const barColors = { Biology:"#22c55e", Physics:"#3b82f6", Chemistry:"#f59e0b" };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black">Analytics 📊</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjectData.map(s=>(
          <div key={s.subject} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{SUB[s.subject].icon}</span>
                <span className="font-bold text-sm">{s.subject}</span>
              </div>
              <span className="text-2xl font-black" style={{color:SUB[s.subject].color,textShadow:`0 0 12px ${SUB[s.subject].neon}55`}}>{s.pct}%</span>
            </div>
            <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{width:`${s.pct}%`,background:SUB[s.subject].color,boxShadow:`0 0 8px ${SUB[s.subject].neon}`}}/>
            </div>
            <p className="text-[11px] opacity-30 mt-2">{s.done}/{s.total} tasks completed</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-5">
        <p className="label-xs mb-4">Weekly Task Completion</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="week" tick={{fill:"rgba(255,255,255,0.3)",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"rgba(255,255,255,0.3)",fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#0d1021",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:12}}/>
            <Bar dataKey="tasks" fill="#3b82f6" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-5">
        <p className="label-xs mb-4">MCQs Solved Per Week</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="week" tick={{fill:"rgba(255,255,255,0.3)",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"rgba(255,255,255,0.3)",fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#0d1021",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:12}}/>
            <Line type="monotone" dataKey="mcqs" stroke="#22c55e" strokeWidth={2.5} dot={{fill:"#22c55e",r:5,strokeWidth:0}} activeDot={{r:7}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════════
function Sidebar({ active, setActive, completionPct, doneTasks }) {
  const nav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"timetable", icon:"📋", label:"Timetable" },
    { id:"schedule",  icon:"📅", label:"30-Day Plan" },
    { id:"today",     icon:"🎯", label:"Today Focus" },
    { id:"analytics", icon:"📊", label:"Analytics" },
    { id:"tools",     icon:"⏱", label:"Study Tools" },
  ];
  return (
    <div className="w-60 flex-shrink-0 flex flex-col border-r border-white/[0.07] h-full fixed top-0 left-0 bottom-0 z-30"
      style={{background:"#080b16"}}>
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{background:"linear-gradient(135deg,#3b82f6,#a855f7)",boxShadow:"0 0 20px rgba(59,130,246,0.4)"}}>
            🧬
          </div>
          <div>
            <p className="font-black text-sm text-white leading-tight">NEET 2026</p>
            <p className="text-[10px] text-white/30 font-medium">30-Day War Plan</p>
          </div>
        </div>
        {/* Mini progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-white/25">Overall Progress</span>
            <span className="text-[10px] font-bold text-blue-400">{completionPct}%</span>
          </div>
          <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${completionPct}%`,background:"linear-gradient(90deg,#3b82f6,#a855f7)",boxShadow:"0 0 8px #3b82f6"}}/>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item=>(
          <button key={item.id} onClick={()=>setActive(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              active===item.id
                ?"text-white border border-blue-500/40"
                :"text-white/35 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
            }`}
            style={active===item.id?{background:"rgba(59,130,246,0.12)",boxShadow:"0 0 12px rgba(59,130,246,0.08)"}:{}}>
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      {/* Bottom info */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="rounded-xl bg-white/[0.04] p-3 text-center">
          <p className="text-[10px] text-white/25 uppercase tracking-widest">Tasks Done</p>
          <p className="text-xl font-black text-white mt-0.5">{doneTasks}</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [schedule, setSchedule] = useStoredSchedule();
  const [active, setActive] = useState("dashboard");
  const [expandedDay, setExpandedDay] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSub, setFilterSub] = useState("All");
  const [quoteIdx] = useState(()=>Math.floor(Math.random()*QUOTES.length));
  const [showQuote, setShowQuote] = useState(true);
  const countdown = useCountdown();
  const today = 1;

  const allTasks = schedule.flatMap(d=>d.sessions);
  const doneTasks = allTasks.filter(t=>t.done);
  const totalMcqs = doneTasks.reduce((a,t)=>a+t.mcqs,0);
  const completionPct = allTasks.length?Math.round(doneTasks.length/allTasks.length*100):0;
  const todayData = schedule[today-1];
  const todayDone = todayData?.sessions.filter(s=>s.done).length||0;
  const todayTotal = todayData?.sessions.length||0;

  const handleToggle = useCallback(id=>{
    setSchedule(prev=>prev.map(d=>({...d,sessions:d.sessions.map(s=>s.id===id?{...s,done:!s.done}:s)})));
  },[setSchedule]);

  const filteredSchedule = schedule.filter(d=>{
    if(!search && filterSub==="All") return true;
    return d.sessions.some(s=>
      (filterSub==="All"||s.subject===filterSub)&&
      (!search||s.label.toLowerCase().includes(search.toLowerCase())||
       (d.bio&&d.bio.toLowerCase().includes(search.toLowerCase()))||
       (d.chem&&d.chem.toLowerCase().includes(search.toLowerCase()))||
       (d.phy&&d.phy.toLowerCase().includes(search.toLowerCase())))
    );
  });

  const weeks = [1,2,3,4];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Space Grotesk',sans-serif;background:#060912;color:#fff;}
        .glass-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;}
        .label-xs{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.3);}
        .btn-pill{padding:8px 18px;border-radius:50px;border:1px solid;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.15s;font-family:'Space Grotesk',sans-serif;}
        .btn-pill:hover{transform:translateY(-1px);}
        .btn-pill:active{transform:scale(0.97);}
        .neon-blue{box-shadow:0 0 20px rgba(59,130,246,0.25);}
        .neon-green{box-shadow:0 0 20px rgba(34,197,94,0.25);}
        .neon-purple{box-shadow:0 0 20px rgba(168,85,247,0.25);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
        table{border-collapse:collapse;width:100%;}
      `}</style>

      <div style={{minHeight:"100vh",background:"#060912",display:"flex"}}>
        <Sidebar active={active} setActive={setActive} completionPct={completionPct} doneTasks={doneTasks.length}/>

        <div style={{flex:1,marginLeft:"240px",minHeight:"100vh"}}>
          {/* Sticky top bar */}
          <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(6,9,18,0.92)",backdropFilter:"blur(16px)",
            borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 24px",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{height:4,width:200,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${completionPct}%`,background:"linear-gradient(90deg,#3b82f6,#a855f7)",
                  borderRadius:4,boxShadow:"0 0 8px #3b82f6",transition:"width 0.7s"}}/>
              </div>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:600}}>{completionPct}% complete</span>
            </div>
            <div style={{display:"flex",gap:20,fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:600}}>
              <span>⏰ {countdown.days}d {countdown.hours}h {countdown.mins}m to NEET</span>
              <span>✅ {doneTasks.length} tasks</span>
              <span>📝 {totalMcqs} MCQs</span>
            </div>
          </div>

          <div style={{padding:"24px",maxWidth:900,margin:"0 auto"}}>
            <AnimatePresence mode="wait">

              {/* ════ DASHBOARD ════ */}
              {active==="dashboard" && (
                <motion.div key="dashboard" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
                  <div style={{marginBottom:24}}>
                    <h1 style={{fontSize:32,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1}}>War Room 🎯</h1>
                    <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:6}}>NEET 2026 · June 21 · Your 30-Day Command Center</p>
                  </div>

                  {/* Countdown */}
                  <div style={{borderRadius:20,background:"linear-gradient(135deg,rgba(59,130,246,0.1),rgba(168,85,247,0.1))",
                    border:"1px solid rgba(59,130,246,0.25)",padding:"24px",marginBottom:20,
                    boxShadow:"0 0 40px rgba(59,130,246,0.08)"}}>
                    <p className="label-xs" style={{marginBottom:16}}>Countdown to NEET 2026 — June 21</p>
                    <div style={{display:"flex",gap:32}}>
                      {[["Days",countdown.days],["Hours",countdown.hours],["Mins",countdown.mins],["Secs",countdown.secs]].map(([l,v])=>(
                        <div key={l} style={{textAlign:"center"}}>
                          <div style={{fontSize:44,fontWeight:900,letterSpacing:"-0.04em",fontFamily:"'JetBrains Mono',monospace",
                            color:"#60a5fa",textShadow:"0 0 20px rgba(96,165,250,0.5)"}}>{String(v).padStart(2,"0")}</div>
                          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.25)",marginTop:4}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    {[
                      {label:"Overall",value:`${completionPct}%`,color:"#60a5fa",glow:"#3b82f6"},
                      {label:"MCQs Solved",value:totalMcqs.toLocaleString(),color:"#4ade80",glow:"#22c55e"},
                      {label:"Tasks Done",value:doneTasks.length,color:"#fbbf24",glow:"#f59e0b"},
                      {label:"Days Left",value:countdown.days,color:"#f87171",glow:"#ef4444"},
                    ].map(s=>(
                      <div key={s.label} className="glass-card" style={{padding:16}}>
                        <p className="label-xs" style={{marginBottom:8}}>{s.label}</p>
                        <p style={{fontSize:28,fontWeight:900,color:s.color,letterSpacing:"-0.03em",
                          textShadow:`0 0 16px ${s.glow}66`}}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Today card */}
                  <div style={{borderRadius:16,background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.25)",
                    padding:20,marginBottom:16,boxShadow:"0 0 24px rgba(59,130,246,0.07)"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,fontWeight:900,background:"#3b82f6",color:"#fff",padding:"3px 10px",borderRadius:50,letterSpacing:"0.1em"}}>TODAY · DAY {today}</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{todayDone}/{todayTotal} done</span>
                      </div>
                      <button onClick={()=>setActive("today")}
                        style={{fontSize:11,color:"#60a5fa",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>
                        Open Focus Mode →
                      </button>
                    </div>
                    <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:12}}>{todayData?.title||todayData?.bio}</p>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {todayData?.sessions.slice(0,4).map(s=>(
                        <span key={s.id} style={{fontSize:11,padding:"5px 10px",borderRadius:8,fontWeight:600,
                          background:s.done?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.05)",
                          color:s.done?"#4ade80":"rgba(255,255,255,0.45)",
                          textDecoration:s.done?"line-through":"none"}}>
                          {s.label.split(":")[0].replace(/[🌅☀️🌆🌙]/g,"").trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <AnimatePresence>
                    {showQuote && (
                      <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.97}}
                        style={{borderRadius:16,background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.2)",
                          padding:20,marginBottom:20,position:"relative"}}>
                        <button onClick={()=>setShowQuote(false)}
                          style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:16}}>✕</button>
                        <p className="label-xs" style={{color:"rgba(251,191,36,0.6)",marginBottom:8}}>Daily Motivation</p>
                        <p style={{fontSize:14,fontStyle:"italic",color:"rgba(255,255,255,0.7)",lineHeight:1.6}}>"{QUOTES[quoteIdx]}"</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subject progress */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                    {Object.entries(SUB).map(([sub,style])=>{
                      const tasks=allTasks.filter(t=>t.subject===sub);
                      const done=tasks.filter(t=>t.done).length;
                      const pct=tasks.length?Math.round(done/tasks.length*100):0;
                      return (
                        <div key={sub} className="glass-card" style={{padding:16}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                            <span style={{fontSize:13,fontWeight:700}}>{style.icon} {sub}</span>
                            <span style={{fontSize:22,fontWeight:900,color:style.color,textShadow:`0 0 12px ${style.neon}55`}}>{pct}%</span>
                          </div>
                          <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:style.color,borderRadius:3,
                              boxShadow:`0 0 8px ${style.neon}`,transition:"width 0.7s"}}/>
                          </div>
                          <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:8}}>{done}/{tasks.length} tasks</p>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
                    <button onClick={()=>{if(window.confirm("Reset all progress?"))setSchedule(INIT_SCHEDULE);}}
                      style={{fontSize:11,color:"rgba(239,68,68,0.5)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>
                      ↺ Reset all progress
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ════ TIMETABLE ════ */}
              {active==="timetable" && (
                <motion.div key="timetable" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div style={{marginBottom:24}}>
                    <h1 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.02em"}}>Official Timetable 📋</h1>
                    <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:4}}>Exact week-by-week study plan as prescribed</p>
                  </div>
                  <TimetableView schedule={schedule}/>
                </motion.div>
              )}

              {/* ════ 30-DAY PLAN ════ */}
              {active==="schedule" && (
                <motion.div key="schedule" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div style={{marginBottom:20}}>
                    <h1 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.02em"}}>30-Day Battle Plan 📅</h1>
                    <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:4}}>Click any day card to expand sessions</p>
                  </div>
                  {/* Search + filter */}
                  <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search chapters, topics..."
                      style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
                        borderRadius:12,padding:"9px 14px",fontSize:12,color:"#fff",
                        outline:"none",width:220,fontFamily:"'Space Grotesk',sans-serif"}}
                    />
                    <div style={{display:"flex",gap:6}}>
                      {["All","Biology","Physics","Chemistry"].map(s=>(
                        <button key={s} onClick={()=>setFilterSub(s)}
                          style={{padding:"8px 14px",borderRadius:50,fontSize:11,fontWeight:700,cursor:"pointer",
                            fontFamily:"'Space Grotesk',sans-serif",border:"1px solid",transition:"all 0.15s",
                            background:filterSub===s?"#3b82f6":"rgba(255,255,255,0.04)",
                            color:filterSub===s?"#fff":"rgba(255,255,255,0.4)",
                            borderColor:filterSub===s?"#3b82f6":"rgba(255,255,255,0.1)",
                            boxShadow:filterSub===s?"0 0 12px rgba(59,130,246,0.4)":"none"}}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {weeks.map(w=>{
                    const wDays = filteredSchedule.filter(d=>d.week===w);
                    if(!wDays.length) return null;
                    return <WeekGroup key={w} weekNum={w} days={wDays} schedule={schedule} onToggle={handleToggle}
                      expandedDay={expandedDay} setExpandedDay={setExpandedDay} today={today}/>;
                  })}
                </motion.div>
              )}

              {/* ════ TODAY FOCUS ════ */}
              {active==="today" && (
                <motion.div key="today" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div style={{marginBottom:24}}>
                    <span style={{display:"inline-block",fontSize:10,fontWeight:900,background:"rgba(59,130,246,0.2)",
                      color:"#60a5fa",border:"1px solid rgba(59,130,246,0.35)",padding:"4px 12px",borderRadius:50,
                      letterSpacing:"0.12em",marginBottom:12,boxShadow:"0 0 12px rgba(59,130,246,0.2)"}}>
                      TODAY FOCUS MODE · DAY {today}
                    </span>
                    <h1 style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em"}}>{todayData?.bio||todayData?.morning}</h1>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10}}>
                      <div style={{height:4,width:180,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${todayTotal?Math.round(todayDone/todayTotal*100):0}%`,
                          background:"#3b82f6",borderRadius:4,boxShadow:"0 0 8px #3b82f6",transition:"width 0.5s"}}/>
                      </div>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:600}}>{todayDone}/{todayTotal} done</span>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                    {todayData?.sessions.map(s=><SessionRow key={s.id} session={s} onToggle={handleToggle}/>)}
                  </div>
                  {/* Targets */}
                  <div style={{borderRadius:16,background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.2)",padding:20}}>
                    <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(251,191,36,0.7)",marginBottom:16}}>⚡ Daily Targets</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,textAlign:"center"}}>
                      {[["350+","MCQs","#4ade80"],["5:30 AM","Wake Up","#60a5fa"],["11:15 PM","Sleep","#c084fc"],["3L+","Water","#38bdf8"]].map(([v,l,c])=>(
                        <div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:12}}>
                          <p style={{fontSize:20,fontWeight:900,color:c,textShadow:`0 0 12px ${c}55`}}>{v}</p>
                          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════ ANALYTICS ════ */}
              {active==="analytics" && (
                <motion.div key="analytics" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <Analytics schedule={schedule}/>
                </motion.div>
              )}

              {/* ════ TOOLS ════ */}
              {active==="tools" && (
                <motion.div key="tools" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <h1 style={{fontSize:24,fontWeight:900,letterSpacing:"-0.02em",marginBottom:24}}>Study Tools ⚙️</h1>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <PomodoroTimer/>
                    {/* MCQ Counter */}
                    <div className="glass-card" style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
                      <p className="label-xs">MCQs Solved</p>
                      <p style={{fontSize:52,fontWeight:900,color:"#4ade80",textAlign:"center",letterSpacing:"-0.04em",
                        textShadow:"0 0 24px rgba(74,222,128,0.4)",fontFamily:"'JetBrains Mono',monospace"}}>
                        {totalMcqs.toLocaleString()}
                      </p>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                        {Object.entries(SUB).map(([sub,style])=>{
                          const mcqs=schedule.flatMap(d=>d.sessions).filter(s=>s.subject===sub&&s.done).reduce((a,s)=>a+s.mcqs,0);
                          return (
                            <div key={sub} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                              <p style={{fontSize:18,fontWeight:900,color:style.color}}>{mcqs}</p>
                              <p style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:4,fontWeight:700}}>{sub.slice(0,4)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* High Yield */}
                    <div className="glass-card" style={{padding:20,gridColumn:"1/-1"}}>
                      <p className="label-xs" style={{marginBottom:14}}>⭐ High Weightage Chapters</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {[
                          {ch:"Human Physiology",sub:"Biology"},{ch:"Genetics & Evolution",sub:"Biology"},
                          {ch:"Ecology",sub:"Biology"},{ch:"Cell Biology",sub:"Biology"},
                          {ch:"Chemical Bonding",sub:"Chemistry"},{ch:"Thermodynamics",sub:"Chemistry"},
                          {ch:"Organic Chemistry",sub:"Chemistry"},{ch:"Equilibrium",sub:"Chemistry"},
                          {ch:"Current Electricity",sub:"Physics"},{ch:"Ray Optics",sub:"Physics"},
                          {ch:"Moving Charges",sub:"Physics"},{ch:"Modern Physics",sub:"Physics"},
                        ].map(({ch,sub})=>(
                          <span key={ch} style={{fontSize:11,padding:"5px 12px",borderRadius:50,fontWeight:700,cursor:"default",
                            background:SUB[sub].glow,color:SUB[sub].neon,border:`1px solid ${SUB[sub].color}33`}}>
                            {SUB[sub].icon} {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Rhythm */}
                    <div className="glass-card" style={{padding:20,gridColumn:"1/-1",background:"rgba(168,85,247,0.04)",borderColor:"rgba(168,85,247,0.2)"}}>
                      <p className="label-xs" style={{color:"rgba(192,132,252,0.7)",marginBottom:16}}>⏰ Daily Warrior Rhythm</p>
                      <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
                        {[["🌅","5:30 AM","Wake Up & Study"],["🧘","6:00 AM","Morning Session"],["☀️","12:00 PM","Afternoon Session"],
                          ["🌆","6:00 PM","Evening Session"],["📔","9:00 PM","Error Notebook"],["🌙","11:15 PM","Sleep"]].map(([icon,time,label])=>(
                          <div key={time} style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:20}}>{icon}</span>
                            <div>
                              <p style={{fontSize:14,fontWeight:900,fontFamily:"'JetBrains Mono',monospace"}}>{time}</p>
                              <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600}}>{label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
