import React, { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid, LabelList
} from 'recharts';
import {
  Calendar, FileText, MapPin, MessageSquare, Users, Sparkles, Shield,
  ChevronRight, Search, ArrowUpRight, Mail, Check, Clock, AlertTriangle,
  Eye, EyeOff, Building2, Trees, Car, GraduationCap, Home, Briefcase,
  CircleDot, Layers, BarChart3, Target, FileSearch, ClipboardCheck,
  TrendingUp, TrendingDown, Minus, Activity, Lock, HelpCircle, Menu,
  ThumbsUp, ThumbsDown, CircleHelp, Send,
  Terminal, Upload, Settings, ChevronLeft, Zap, Rocket, Database, Globe
} from 'lucide-react';

/* ============================================================
   FONTS
   Style A: Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono
   Style B: Public Sans (display) + Atkinson Hyperlegible (body, designed for low vision)
   ============================================================ */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:wght@400;500;600;700;800&display=swap');

.font-display-a { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
.font-body-a    { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.font-mono-a    { font-family: 'IBM Plex Mono', monospace; }

.font-display-b { font-family: 'Public Sans', system-ui, sans-serif; letter-spacing: -0.01em; }
.font-body-b    { font-family: 'Atkinson Hyperlegible', system-ui, sans-serif; }

.grain      { background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0); background-size: 24px 24px; }
.grain-dark { background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0); background-size: 24px 24px; }
`;

/* ============================================================
   DATA (shared across both styles)
   ============================================================ */

const PROJECT = {
  name: 'Cherry Creek Commons',
  location: 'Cherrywood, Colorado',
  applicant: 'Meridian Development Partners',
  firm: 'Lattice Public Affairs',
  parcels: '12.4 acres',
  zoning: { current: 'I-1 (Light Industrial)', proposed: 'MX-3 (Mixed-Use, Mid-Rise)' },
  description:
    '240 residences, 18,000 sq ft of neighborhood retail, and a 1.2-acre public plaza on the former Henderson Industrial site.',
  hearing: 'October 14, 2026',
  stats: { comments: 1247, supporters: 783, opposed: 312, movable: 152 }
};

// Two label sets: terse (Style A) vs. plain-English (Style B)
const PHASES = [
  { id: 1, labelA: 'Pre-Submittal',  labelB: 'Introducing the project',         subA: 'Vision & introduction',      subB: 'Telling the community what\u2019s being proposed and why',                window: 'Apr — Jul 2026' },
  { id: 2, labelA: 'Referral Period',labelB: 'Public comment & agency review',  subA: 'Comment & agency review',    subB: 'Residents, businesses, and city departments share input',                window: 'Aug — Sep 2026' },
  { id: 3, labelA: 'Hearing Prep',   labelB: 'Planning Commission & Council',   subA: 'Commission & Council',       subB: 'Final hearings where the project is voted on',                           window: 'Oct — Nov 2026' }
];

const PROCESS = [
  { key: 'pre', labelA: 'Pre-Submittal',       labelB: 'Project introduced' },
  { key: 'sub', labelA: 'Formal Submittal',    labelB: 'Application submitted' },
  { key: 'ref', labelA: 'Referral Period',     labelB: 'Agency review' },
  { key: 'pub', labelA: 'Public Comment',      labelB: 'Public comment period' },
  { key: 'pc',  labelA: 'Planning Commission', labelB: 'Planning Commission hearing' },
  { key: 'cc',  labelA: 'City Council',        labelB: 'City Council vote' }
];
const PHASE_TO_STEP = { 1: 0, 2: 2, 3: 4 };

const CLUSTERS = [
  { theme: 'Traffic & Circulation', count: 287, sentiment: -0.32, status: 'Addressed' },
  { theme: 'Building Height',       count: 213, sentiment: -0.18, status: 'Addressed' },
  { theme: 'Public Plaza',          count: 189, sentiment:  0.54, status: 'Supported' },
  { theme: 'Affordable Housing %',  count: 156, sentiment:  0.21, status: 'In Progress' },
  { theme: 'Parking Supply',        count: 142, sentiment: -0.41, status: 'Open' },
  { theme: 'School Capacity',       count:  98, sentiment: -0.09, status: 'Open' },
  { theme: 'Wildlife Corridor',     count:  87, sentiment: -0.27, status: 'Addressed' },
  { theme: 'Local Retail Mix',      count:  75, sentiment:  0.62, status: 'Supported' }
];

const COUNCIL = [
  { name: 'M. Alvarez',  district: 'D1', stance: 'Support',  note: 'Housing supply champion. Cite tax-base + HMP §2.4.' },
  { name: 'D. Whitfield',district: 'D2', stance: 'Movable',  note: 'Traffic anxiety — share TIA + signal upgrade commitment.' },
  { name: 'S. Patel',    district: 'D3', stance: 'Oppose',   note: 'Hard no on density. Do not pursue conversion.' },
  { name: 'L. Brennan',  district: 'D4', stance: 'Support',  note: 'Walkability + transit. Already aligned.' },
  { name: 'T. Okonkwo',  district: 'D5', stance: 'Movable',  note: 'Wants design quality assurance. Renderings + arch credentials.' },
  { name: 'R. Hayes',    district: 'D6', stance: 'Oppose',   note: 'Infrastructure cost concerns. Stretch CFP case study.' },
  { name: 'K. Lindgren', district: 'AL', stance: 'Movable',  note: 'Wildlife + sustainability. Lean into corridor preservation.' }
];

const RESPONSE_QUEUE = [
  { id: 'r-184', theme: 'Building Height',
    excerpt: 'A 5-story building will tower over our neighborhood and block the mountain view from Linden Park…',
    draft: 'We heard the concern about scale at the western edge. The revised site plan steps the building down to 3 stories along Linden Avenue and preserves the established view corridor identified in the 2021 Comprehensive Plan (§4.3, Neighborhood Edge Transitions, p. 87). The full elevation study is in the Document Library.',
    citation: 'Comp Plan §4.3, p. 87', status: 'awaiting_approval', score: 0.91 },
  { id: 'r-201', theme: 'Parking Supply',
    excerpt: 'There will not be enough parking. The streets are already packed during weekday evenings…',
    draft: 'Thank you for flagging on-street demand. The current proposal provides 1.4 spaces per residence (336 total) plus 42 retail spaces, exceeding the MX-3 minimum (1.1) per Zoning Code §17.40.040. We are commissioning a third-party parking study before the Planning Commission hearing.',
    citation: 'Zoning Code §17.40.040', status: 'awaiting_approval', score: 0.87 },
  { id: 'r-217', theme: 'Affordable Housing %',
    excerpt: 'Why isn\u2019t more of this housing affordable? Cherrywood needs deed-restricted units, not market-rate luxury…',
    draft: '[DRAFT — needs Lattice review] The current proposal includes 12% affordable units at 80% AMI, exceeding the 10% inclusionary requirement. We are exploring a partnership with the Cherrywood Housing Trust to deepen affordability on a portion of units.',
    citation: 'IHO §17.62.020', status: 'flagged_for_review', score: 0.62 }
];

const RECENT_COMMENTS = [
  { name: 'James K.',  zip: '80206', tag: 'Resident', text: 'Love the plaza idea — Cherrywood needs more walkable space.', stance: 'support' },
  { name: 'Maria S.',  zip: '80207', tag: 'Resident', text: 'Traffic on Linden is already terrible. How is 240 units going to help?', stance: 'oppose' },
  { name: 'David L.',  zip: '80206', tag: 'Business', text: 'Ground-floor retail would be a huge win for the corridor.', stance: 'support' },
  { name: 'Anne R.',   zip: '80208', tag: 'Resident', text: 'Five stories is too tall for this block. Step it down or reduce units.', stance: 'oppose' },
  { name: 'Cory P.',   zip: '80206', tag: 'Resident', text: 'Need to see real affordable units, not just compliance minimums.', stance: 'movable' }
];

const RESPONSIVENESS = [
  { concern: 'Building height at western edge', change: 'Stepped down to 3 stories along Linden',         doc: 'Comp Plan §4.3' },
  { concern: 'Loss of mature trees',            change: 'Revised plan preserves 18 of 24 specimen trees', doc: 'Landscape Std §6.2' },
  { concern: 'Inadequate plaza programming',    change: 'Added farmers-market easement + plaza endowment', doc: 'Comp Plan §3.1' },
  { concern: 'Wildlife corridor disruption',    change: 'Increased setback to 60 ft along creek',          doc: 'WCO §22.04' },
  { concern: 'Parking shortfall risk',          change: 'Increased to 1.4 spaces/unit + parking study',    doc: 'ZC §17.40' }
];

const HEAT_GRID = [
  [0.10, 0.18, 0.22, 0.30, 0.25, 0.15, 0.08, 0.05],
  [0.22, 0.35, 0.48, 0.55, 0.42, 0.28, 0.12, 0.10],
  [0.30, 0.55, 0.78, null, 0.62, 0.40, 0.20, 0.12],
  [0.28, 0.48, 0.65, 0.58, 0.50, 0.32, 0.18, 0.10],
  [0.18, 0.28, 0.35, 0.32, 0.28, 0.22, 0.14, 0.08],
  [0.10, 0.15, 0.20, 0.22, 0.18, 0.14, 0.08, 0.05]
];

const SAMPLE_ANSWERS = {
  height: {
    text: 'The proposed building height of 3–5 stories complies with the MX-3 district maximum of 65 feet. Along the western edge facing Linden Avenue, the revised plan steps down to 3 stories per the Neighborhood Edge Transitions requirement.',
    citations: [
      { doc: 'Comprehensive Plan', loc: '§4.3, p. 87' },
      { doc: 'Zoning Code',        loc: '§17.32.060' }
    ]
  },
  parking: {
    text: 'The proposal provides 1.4 parking spaces per residence (336 total) plus 42 retail spaces, exceeding the MX-3 minimum of 1.1 spaces per unit.',
    citations: [{ doc: 'Zoning Code', loc: '§17.40.040' }]
  },
  affordable: {
    text: 'The plan includes 12% affordable units restricted at 80% AMI, exceeding the 10% inclusionary minimum. The applicant is exploring deeper affordability through a partnership with the Cherrywood Housing Trust.',
    citations: [
      { doc: 'Inclusionary Housing Ordinance', loc: '§17.62.020' },
      { doc: 'Housing Master Plan',           loc: '§2.4' }
    ]
  }
};

function lookupAnswer(term) {
  const t = term.toLowerCase();
  if (t.includes('park')) return SAMPLE_ANSWERS.parking;
  if (t.includes('afford') || t.includes('rent') || t.includes('hous')) return SAMPLE_ANSWERS.affordable;
  return SAMPLE_ANSWERS.height;
}

/* ============================================================
   ROOT
   ============================================================ */

export default function App() {
  const [styleVariant, setStyleVariant] = useState('B');
  const [view, setView] = useState('public');
  const [phase, setPhase] = useState(2);

  function body() {
    if (view === 'builder') return <BuilderConsole />;
    if (view === 'internal') return <StyleBInternal phase={phase} />; // Internal dashboard is always the light/clean version, regardless of Design choice
    return styleVariant === 'A' ? <StyleAPublic phase={phase} /> : <StyleBPublic phase={phase} />;
  }

  return (
    <div className={styleVariant === 'A' ? 'font-body-a' : 'font-body-b'}>
      <style>{FONTS}</style>
      <TopBar
        styleVariant={styleVariant} setStyleVariant={setStyleVariant}
        view={view} setView={setView}
        phase={phase} setPhase={setPhase}
      />
      {body()}
    </div>
  );
}

/* ============================================================
   SHARED TOP BAR (responsive, theme-aware)
   ============================================================ */

function TopBar({ styleVariant, setStyleVariant, view, setView, phase, setPhase }) {
  const isA = styleVariant === 'A';
  const isBuilder = view === 'builder';
  // Only Builder gets the dark engineering top bar. Internal stays light.
  const dark = isBuilder;

  // Inline style for top bar — guarantees opaque background renders immediately
  // (Tailwind dynamic className interpolation can have paint-timing issues)
  const topBarStyle = isBuilder
    ? { background: '#070A12', borderBottom: '1px solid rgba(255,255,255,0.10)', color: '#F5F5F4' }
    : isA
      ? { background: '#F5F0E6', borderBottom: '1px solid #D6D3D1', color: '#1C1917' }
      : { background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', color: '#111827' };

  const monoClass = isA ? 'font-mono-a' : 'font-display-b';

  return (
    <div className="sticky top-0 z-50" style={topBarStyle}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* ROW 1 — wordmark + mode-specific controls */}
        <div className="flex items-center gap-3 py-3">
          <Wordmark isA={isA} dark={dark} />
          <div className="flex-1" />

          {!isBuilder ? (
            <>
              {/* Desktop: Design + View (Public/Internal only) + Builder launch */}
              <div className="hidden md:flex items-center gap-2">
                <SegmentedToggle
                  label="Design"
                  value={styleVariant}
                  options={[
                    { v: 'B', label: 'Accessible', title: 'High-contrast design meeting WCAG accessibility standards.', badge: 'Recommended' },
                    { v: 'A', label: 'Editorial',  title: 'Magazine-style design with serif headlines.' }
                  ]}
                  onChange={setStyleVariant}
                  isA={isA}
                  dark={dark}
                />
                <SegmentedToggle
                  label="View"
                  value={view}
                  options={[
                    { v: 'public',   label: 'Public',   icon: Eye },
                    { v: 'internal', label: 'Internal', icon: Lock }
                  ]}
                  onChange={setView}
                  isA={isA}
                  dark={dark}
                />
                <BuilderLaunch onClick={() => setView('builder')} />
              </div>

              {/* Mobile: just the Builder launch button on row 1 */}
              <div className="md:hidden">
                <BuilderLaunch compact onClick={() => setView('builder')} />
              </div>
            </>
          ) : (
            // BUILDER MODE — only an Exit button
            <button
              onClick={() => setView('public')}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              style={{
                background: 'transparent',
                color: '#5CFFB8',
                border: '1px solid rgba(92,255,184,0.45)',
                minHeight: 44
              }}
            >
              <ChevronLeft size={16} /> Exit Builder
            </button>
          )}
        </div>

        {/* Mobile rows for Design + View — only when NOT in Builder */}
        {!isBuilder && (
          <>
            <div className="md:hidden pb-3">
              <SegmentedToggle
                label="Design"
                value={styleVariant}
                options={[
                  { v: 'B', label: 'Accessible', title: 'High-contrast design meeting WCAG accessibility standards.', badge: 'Recommended' },
                  { v: 'A', label: 'Editorial',  title: 'Magazine-style design with serif headlines.' }
                ]}
                onChange={setStyleVariant}
                isA={isA}
                dark={dark}
                fullWidth
              />
            </div>
            <div className="md:hidden pb-3">
              <SegmentedToggle
                label="View"
                value={view}
                options={[
                  { v: 'public',   label: 'Public',   icon: Eye },
                  { v: 'internal', label: 'Internal', icon: Lock }
                ]}
                onChange={setView}
                isA={isA}
                dark={dark}
                fullWidth
              />
            </div>
          </>
        )}

        {/* ROW 4 — Phase pills (only on Public; hidden on Internal & Builder). */}
        {view === 'public' && (
          <>
            {/* Mobile: compact stepper — three small pills + active phase label. No horizontal scroll. */}
            <div className="md:hidden pb-3">
              <div className="flex items-center gap-2 mb-2">
                {PHASES.map((p) => {
                  const active = phase === p.id;
                  const fg = active
                    ? (isA ? '#F5F0E6' : '#FFFFFF')
                    : (isA ? '#44403C' : '#374151');
                  const bg = active
                    ? (isA ? '#0A1628' : '#0050B4')
                    : 'transparent';
                  const bd = active
                    ? (isA ? '#0A1628' : '#0050B4')
                    : (isA ? 'rgba(28,25,23,0.18)' : '#D1D5DB');
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPhase(p.id)}
                      aria-label={`Phase ${p.id}: ${isA ? p.labelA : p.labelB}`}
                      style={{
                        flex: 1, minHeight: 44, padding: '8px 10px',
                        borderRadius: isA ? 3 : 6,
                        background: bg, color: fg,
                        border: `1px solid ${bd}`,
                        fontWeight: active ? 700 : 500,
                        fontSize: 13,
                        fontFamily: 'IBM Plex Mono, monospace',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s, color 0.15s'
                      }}
                    >
                      {String(p.id).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
              <div>
                <div className={`${monoClass} text-[10px] uppercase tracking-[0.18em] mb-1 font-medium ${isA ? 'text-stone-500' : 'text-gray-500'}`}>
                  Phase {phase} of 3
                </div>
                <div className={`text-base font-semibold leading-snug ${isA ? 'text-stone-900' : 'text-gray-900'}`}>
                  {isA ? PHASES[phase - 1].labelA : PHASES[phase - 1].labelB}
                </div>
              </div>
            </div>

            {/* Desktop: full label pills */}
            <div className="hidden md:block pb-3">
              <div className="flex items-center gap-2">
                <span className={`${monoClass} text-[11px] uppercase tracking-[0.18em] mr-2 whitespace-nowrap ${
                  isA ? 'text-stone-500' : 'text-gray-500'
                }`}>Phase</span>
                {PHASES.map((p) => {
                  const active = phase === p.id;
                  const label = isA ? p.labelA : p.labelB;
                  const sub = isA ? p.subA : p.subB;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPhase(p.id)}
                      className={`px-3 py-2 text-left transition-all whitespace-nowrap min-h-[44px] ${
                        isA ? 'rounded-sm' : 'rounded-md border'
                      } ${
                        active
                          ? isA
                            ? 'bg-[#0A1628] text-[#F5F0E6] font-semibold border-[#0A1628]'
                            : 'bg-[#0050B4] text-white font-semibold border-[#0050B4]'
                          : isA
                            ? 'text-stone-600 hover:text-stone-900 border-transparent'
                            : 'text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${monoClass} text-xs ${isA ? (active ? 'opacity-90' : 'opacity-60') : ''}`}>
                          {String(p.id).padStart(2, '0')}
                        </span>
                        <span className="text-sm">{label}</span>
                      </div>
                      {!isA && (
                        <div className="text-[11px] mt-0.5">{sub}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Wordmark({ isA, dark }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${
        isA ? (dark ? 'bg-[#C8501F] rounded-sm' : 'bg-[#0A1628] rounded-sm') : 'bg-[#0050B4] rounded-md'
      }`}>
        <Layers className={`w-4 h-4 ${isA ? (dark ? 'text-[#0A1628]' : 'text-[#F5F0E6]') : 'text-white'}`} />
      </div>
      <div className="leading-tight min-w-0">
        <div className={`${isA ? 'font-display-a' : 'font-display-b'} font-semibold text-base tracking-tight truncate`}>Lattice</div>
        <div className={`${isA ? 'font-mono-a' : 'font-display-b'} text-[11px] uppercase tracking-[0.14em] truncate font-medium ${
          dark ? 'text-stone-300' : isA ? 'text-stone-700' : 'text-gray-700'
        }`}>
          Site-Builder for Lobbying Firms
        </div>
      </div>
    </div>
  );
}

function BuilderLaunch({ onClick, compact }) {
  return (
    <button
      onClick={onClick}
      title="Open Builder — set up a new project"
      className="flex items-center gap-2 rounded-md font-semibold text-sm transition-all"
      style={{
        background: '#0A0E1A',
        color: '#5CFFB8',
        padding: compact ? '8px 12px' : '8px 14px',
        boxShadow: '0 0 0 1px rgba(92,255,184,0.4), 0 1px 2px rgba(0,0,0,0.2)',
        minHeight: 44,
        whiteSpace: 'nowrap'
      }}
    >
      <Sparkles size={14} style={{ flexShrink: 0 }} />
      {compact ? 'Builder' : 'Open Builder'}
    </button>
  );
}

function SegmentedToggle({ label, value, options, onChange, isA, dark, fullWidth }) {
  // Resolved theme — toggle container + default active styling per context
  const theme = dark
    ? { container: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' },
        activeDefault: { bg: '#F5F0E6', fg: '#0A1628' },
        inactiveColor: '#D6D3D1' }
    : isA
      ? { container: { background: 'rgba(28,25,23,0.07)', border: '1px solid rgba(28,25,23,0.14)' },
          activeDefault: { bg: '#0A1628', fg: '#F5F0E6' },
          inactiveColor: '#44403C' }
      : { container: { background: '#F3F4F6', border: '1px solid #D1D5DB' },
          activeDefault: { bg: '#0050B4', fg: '#FFFFFF' },
          inactiveColor: '#374151' };

  function activeFor(v) {
    if (v === 'internal') return isA
      ? { bg: '#1A2842', fg: '#F5F0E6' }   // Editorial: lighter navy variant — same family as Public navy
      : { bg: '#003D6B', fg: '#FFFFFF' };  // Accessible: darker blue — same family as Public blue
    if (v === 'builder') return dark
      ? { bg: '#5CFFB8', fg: '#0A0E1A' }                              // dark top bar: bright cyan pill pops
      : { bg: '#0A0E1A', fg: '#5CFFB8', ring: '#5CFFB8' };            // light top bar: dark pill with cyan ring
    return theme.activeDefault;
  }

  const radius = isA ? 3 : 6;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2, padding: 4,
      borderRadius: radius,
      ...theme.container,
      width: fullWidth ? '100%' : 'auto'
    }}>
      {options.map((opt) => {
        const active = value === opt.v;
        const Icon = opt.icon;
        const a = activeFor(opt.v);

        const buttonStyle = active ? {
          background: a.bg,
          color: a.fg,
          fontWeight: 600,
          boxShadow: a.ring
            ? `0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px ${a.ring}66`
            : '0 1px 2px rgba(0,0,0,0.15)'
        } : {
          background: 'transparent',
          color: theme.inactiveColor,
          fontWeight: 500
        };

        return (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            aria-pressed={active}
            title={opt.title || `${label}: ${opt.label}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 12px', fontSize: 14, minHeight: 44,
              borderRadius: radius, border: 'none', cursor: 'pointer',
              transition: 'background-color 0.15s, color 0.15s, box-shadow 0.15s',
              flex: fullWidth ? 1 : undefined,
              whiteSpace: 'nowrap',
              ...buttonStyle
            }}
          >
            {Icon && <Icon size={14} style={{ flexShrink: 0 }} />}
            <span>{opt.label}</span>
            {opt.badge && (
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
                background: active ? 'rgba(255,255,255,0.28)' : 'rgba(0,80,180,0.14)',
                color: active ? '#FFFFFF' : '#0050B4'
              }}>
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   ============================================================
   STYLE A — EDITORIAL (Palantir / Bloomberg / Brookings)
   ============================================================
   ============================================================ */

function StyleAPublic({ phase }) {
  return (
    <div className="bg-[#F5F0E6] text-stone-900 min-h-screen grain">
      <HeroA phase={phase} />
      <TimelineA phase={phase} />
      {phase === 1 && <><VisionA /><DocLibraryA compact /><FAQA /></>}
      {phase === 2 && <><DocLibraryA /><MapA /><CommentsA /><ResponsivenessA compact /></>}
      {phase === 3 && <><ResponsivenessA /><HearingA /><DocLibraryA compact /></>}
      <FooterA />
    </div>
  );
}

function HeroA({ phase }) {
  const headlines = { 1: 'A neighborhood, not a project.', 2: 'Your input is shaping this plan.', 3: 'We heard you. Here\u2019s what changed.' };
  const ctas = { 1: { label: 'Get project updates', icon: Mail }, 2: { label: 'Share your input', icon: MessageSquare }, 3: { label: 'RSVP for the hearing', icon: Calendar } };
  const Cta = ctas[phase].icon;
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-[#C8501F]">{PHASES[phase - 1].labelA}</span>
            <span className="h-px flex-1 bg-stone-300" />
            <span className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 hidden sm:inline">{PHASES[phase - 1].window}</span>
          </div>
          <h1 className="font-display-a text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.03] tracking-tight text-stone-900 mb-3 sm:mb-4">
            {PROJECT.name}
          </h1>
          <p className="font-display-a italic text-xl sm:text-2xl text-stone-700 mb-6 sm:mb-8">{headlines[phase]}</p>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">{PROJECT.description}</p>
          <div className="flex flex-wrap gap-3">
            <button className="group bg-[#0A1628] text-[#F5F0E6] px-5 py-3 rounded-sm flex items-center gap-2 text-sm font-medium hover:bg-[#C8501F] transition-all min-h-[44px]">
              <Cta className="w-4 h-4" />{ctas[phase].label}
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="border border-stone-400 text-stone-800 px-5 py-3 rounded-sm flex items-center gap-2 text-sm font-medium hover:bg-stone-900/5 min-h-[44px]">
              <FileText className="w-4 h-4" />View the plan
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="border border-stone-300 bg-white/40 rounded-sm">
            <div className="grid grid-cols-2 divide-x divide-stone-300">
              <FactA label="Site" value={PROJECT.parcels} />
              <FactA label="Hearing" value={PROJECT.hearing} mono />
            </div>
            <div className="grid grid-cols-2 divide-x divide-stone-300 border-t border-stone-300">
              <FactA label="Current Zoning" value={PROJECT.zoning.current} small />
              <FactA label="Proposed" value={PROJECT.zoning.proposed} small accent />
            </div>
            <div className="border-t border-stone-300 p-5">
              <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">Engagement to date</div>
              <div className="grid grid-cols-3 gap-3">
                <StatA n={PROJECT.stats.comments} l="Comments" />
                <StatA n="38" l="Meetings" />
                <StatA n="6" l="Languages" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FactA = ({ label, value, mono, small, accent }) => (
  <div className="p-5">
    <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-1.5">{label}</div>
    <div className={`${mono ? 'font-mono-a' : 'font-display-a'} ${small ? 'text-base' : 'text-2xl'} ${accent ? 'text-[#C8501F]' : 'text-stone-900'} leading-tight`}>{value}</div>
  </div>
);
const StatA = ({ n, l }) => (
  <div>
    <div className="font-display-a text-2xl text-stone-900">{n}</div>
    <div className="font-mono-a text-[9px] uppercase tracking-[0.18em] text-stone-500 mt-0.5">{l}</div>
  </div>
);

function TimelineA({ phase }) {
  const activeIdx = PHASE_TO_STEP[phase];
  return (
    <section className="border-y border-stone-300 bg-white/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-stone-500">Process</span>
          <span className="h-px flex-1 bg-stone-300" />
        </div>
        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-center justify-between gap-2">
          {PROCESS.map((s, i) => {
            const done = i < activeIdx, here = i === activeIdx;
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className={`w-3.5 h-3.5 rounded-full mb-2 flex items-center justify-center ${
                    here ? 'bg-[#C8501F] ring-4 ring-[#C8501F]/20' : done ? 'bg-stone-900' : 'bg-white border border-stone-400'
                  }`}>{here && <CircleDot className="w-3 h-3 text-[#F5F0E6]" />}</div>
                  <div className={`text-xs ${here ? 'font-semibold text-stone-900' : done ? 'text-stone-700' : 'text-stone-500'}`}>{s.labelA}</div>
                  {here && <div className="font-mono-a text-[9px] uppercase tracking-[0.18em] text-[#C8501F] mt-1">You are here</div>}
                </div>
                {i < PROCESS.length - 1 && <div className={`h-px flex-[2] ${done ? 'bg-stone-900' : 'bg-stone-300'}`} />}
              </React.Fragment>
            );
          })}
        </div>
        {/* Mobile: vertical */}
        <div className="md:hidden space-y-3">
          {PROCESS.map((s, i) => {
            const done = i < activeIdx, here = i === activeIdx;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  here ? 'bg-[#C8501F] ring-4 ring-[#C8501F]/20' : done ? 'bg-stone-900' : 'bg-white border border-stone-400'
                }`}>{here && <CircleDot className="w-3 h-3 text-[#F5F0E6]" />}</div>
                <div className={`text-sm ${here ? 'font-semibold text-stone-900' : done ? 'text-stone-700' : 'text-stone-500'}`}>{s.labelA}</div>
                {here && <div className="font-mono-a text-[9px] uppercase tracking-[0.18em] text-[#C8501F] ml-auto">You are here</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SectionA = ({ title, mono, children }) => (
  <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <div className="flex items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8">
      <span className="font-mono-a text-xs text-[#C8501F]">{mono}</span>
      <h2 className="font-display-a text-2xl sm:text-3xl md:text-4xl text-stone-900 tracking-tight">{title}</h2>
      <span className="h-px flex-1 bg-stone-300" />
    </div>
    {children}
  </section>
);

function VisionA() {
  return (
    <SectionA title="The Vision" mono="01">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {[
          { icon: Home, t: '240 Residences', s: 'Including 12% deed-restricted affordable units at 80% AMI.' },
          { icon: Briefcase, t: '18,000 sq ft Retail', s: 'Ground-floor neighborhood retail — café, market, services.' },
          { icon: Trees, t: '1.2-acre Public Plaza', s: 'Permanently dedicated open space with farmers-market easement.' }
        ].map((c, i) => (
          <div key={i} className="col-span-12 md:col-span-4 border border-stone-300 bg-white/40 p-6">
            <c.icon className="w-6 h-6 text-[#C8501F] mb-4" />
            <div className="font-display-a text-2xl text-stone-900 mb-2">{c.t}</div>
            <p className="text-sm text-stone-600 leading-relaxed">{c.s}</p>
          </div>
        ))}
      </div>
    </SectionA>
  );
}

function DocLibraryA({ compact }) {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState(null);
  return (
    <SectionA title="Documents & answers" mono={compact ? '03' : '02'}>
      <div className="border border-stone-300 bg-white/50 rounded-sm p-1 flex items-center mb-1">
        <Search className="w-4 h-4 text-stone-500 ml-3 flex-shrink-0" />
        <input value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && q && setAnswer({ q, ...lookupAnswer(q) })}
          placeholder="Ask about this project…"
          className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-stone-400 min-w-0" />
        <button onClick={() => q && setAnswer({ q, ...lookupAnswer(q) })}
          className="bg-[#0A1628] text-[#F5F0E6] text-xs font-medium px-4 py-2.5 rounded-sm flex items-center gap-2 min-h-[44px]">
          <Sparkles className="w-3.5 h-3.5" /> Ask
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-3 h-3 text-stone-500 flex-shrink-0" />
        <span className="font-mono-a text-[10px] uppercase tracking-[0.16em] text-stone-500">Every answer cites the source. We don’t generate zoning claims.</span>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          {['Try: building height', 'Try: parking', 'Try: affordable housing'].map((t) => (
            <button key={t} onClick={() => { const term = t.replace('Try: ',''); setQ(term); setAnswer({ q: term, ...lookupAnswer(term) }); }}
              className="text-left text-sm text-stone-700 hover:text-[#C8501F] border border-stone-300 px-3 py-2 rounded-sm bg-white/30 min-h-[44px]">
              {t}
            </button>
          ))}
        </div>
        <div className="col-span-12 lg:col-span-9">
          {answer ? (
            <div className="border border-stone-300 bg-white/50 p-5 sm:p-6 rounded-sm">
              <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">You asked</div>
              <div className="font-display-a text-xl mb-4 text-stone-900">{answer.q}</div>
              <p className="text-stone-800 leading-relaxed mb-4">{answer.text}</p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-300">
                {answer.citations.map((c, i) => (
                  <span key={i} className="font-mono-a text-[11px] bg-[#0A1628] text-[#F5F0E6] px-2 py-1 rounded-sm">{c.doc} · {c.loc}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-stone-300 p-6 rounded-sm text-stone-500 text-sm">Ask a question — answers come with citations.</div>
          )}
        </div>
      </div>
    </SectionA>
  );
}

function MapA() {
  const [pins, setPins] = useState([
    { x: 240, y: 180, label: 'Traffic concern' },
    { x: 320, y: 240, label: 'Loves the plaza idea' },
    { x: 180, y: 260, label: 'Height too tall here' }
  ]);
  function dropPin(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 600 / rect.width, scaleY = 360 / rect.height;
    setPins([...pins, { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY, label: 'New comment' }]);
  }
  return (
    <SectionA title="Drop a pin. Tell us about a place." mono="03">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div onClick={dropPin} className="relative bg-[#0A1628] rounded-sm overflow-hidden cursor-crosshair" style={{ aspectRatio: '4/2.4' }}>
            <svg viewBox="0 0 600 360" className="w-full h-full">
              <defs><pattern id="streets" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 0 30 H 60 M 30 0 V 60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" /></pattern></defs>
              <rect width="600" height="360" fill="url(#streets)" />
              {[[60,60,80,60,'#1a2c47'],[160,60,80,60,'#1a2c47'],[260,60,80,60,'#1a2c47'],[360,60,80,60,'#1a2c47'],[460,60,80,60,'#1a2c47'],
                [60,140,80,60,'#1a2c47'],[160,140,80,60,'#1a2c47'],[260,140,80,80,'#C8501F'],[360,140,80,60,'#1a2c47'],[460,140,80,60,'#1a2c47'],
                [60,240,80,60,'#1a2c47'],[160,240,80,60,'#1a2c47'],[260,240,80,60,'#1a2c47'],[360,240,80,60,'#1a2c47'],[460,240,80,60,'#1a2c47']
              ].map(([x,y,w,h,c],i)=>(<rect key={i} x={x} y={y} width={w} height={h} fill={c} opacity={c==='#C8501F'?1:0.55} stroke="rgba(255,255,255,0.08)" />))}
              <text x={300} y={185} textAnchor="middle" fill="#F5F0E6" fontSize="11" fontFamily="IBM Plex Mono" letterSpacing="2">PROJECT SITE</text>
              <text x={300} y={200} textAnchor="middle" fill="#F5F0E6" fontSize="9" fontFamily="IBM Plex Mono" opacity="0.7">12.4 ACRES</text>
              {pins.map((p,i)=>(<g key={i}><circle cx={p.x} cy={p.y} r="6" fill="#F5F0E6" /><circle cx={p.x} cy={p.y} r="3" fill="#C8501F" /></g>))}
            </svg>
            <div className="absolute bottom-3 left-3 font-mono-a text-[10px] text-stone-400 uppercase tracking-[0.18em]">Click anywhere to drop a pin</div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">Recent pins ({pins.length})</div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {pins.slice().reverse().map((p,i)=>(
              <div key={i} className="border border-stone-300 bg-white/50 p-3 text-sm flex gap-3 items-start">
                <MapPin className="w-3.5 h-3.5 text-[#C8501F] mt-0.5 flex-shrink-0" /><div className="flex-1">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionA>
  );
}

function CommentsA() {
  return (
    <SectionA title="Share your input" mono="04">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="border border-stone-300 bg-white/50 p-5 sm:p-6 rounded-sm">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input placeholder="First name" className="bg-white/70 border border-stone-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-[#C8501F] min-h-[44px]" />
              <input placeholder="Last initial" className="bg-white/70 border border-stone-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-[#C8501F] min-h-[44px]" />
            </div>
            <input placeholder="ZIP code (required)" className="w-full bg-white/70 border border-stone-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-[#C8501F] mb-3 min-h-[44px]" />
            <textarea placeholder="Tell us what you think. Be specific — what would make this better?" rows={5}
              className="w-full bg-white/70 border border-stone-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-[#C8501F] mb-3 resize-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />Real-name policy. ZIP-verified. Spam filtered.
              </div>
              <button className="bg-[#0A1628] text-[#F5F0E6] text-sm px-5 py-2 rounded-sm flex items-center gap-2 hover:bg-[#C8501F] min-h-[44px]">
                <MessageSquare className="w-3.5 h-3.5" />Submit
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">Recent comments</div>
          <div className="space-y-3">
            {RECENT_COMMENTS.map((c,i)=>(
              <div key={i} className="border-l-2 pl-4 py-1" style={{ borderLeftColor: c.stance==='support'?'#3F6E3F':c.stance==='oppose'?'#A33':'#C8501F' }}>
                <div className="text-sm text-stone-800 leading-snug mb-1">&ldquo;{c.text}&rdquo;</div>
                <div className="font-mono-a text-[10px] uppercase tracking-[0.16em] text-stone-500">{c.name} · {c.zip} · {c.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionA>
  );
}

function ResponsivenessA({ compact }) {
  return (
    <SectionA title="How we’re listening" mono={compact ? '04' : '02'}>
      <p className="text-stone-700 max-w-2xl mb-6 leading-relaxed">Every concern is tagged, clustered, and reviewed weekly. Here’s what changed.</p>
      <div className="border border-stone-300 bg-white/40 rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 sm:px-5 py-3 border-b border-stone-300 bg-white/30">
          <div className="col-span-12 sm:col-span-4 font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500">You said</div>
          <div className="hidden sm:block sm:col-span-5 font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500">We changed</div>
          <div className="hidden sm:block sm:col-span-3 font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500">Source</div>
        </div>
        {RESPONSIVENESS.map((r,i)=>(
          <div key={i} className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-5 py-4 border-b border-stone-300 last:border-b-0 text-sm">
            <div className="col-span-12 sm:col-span-4 text-stone-700 italic">{r.concern}</div>
            <div className="col-span-12 sm:col-span-5 text-stone-900 flex items-start gap-2"><Check className="w-4 h-4 text-[#C8501F] mt-0.5 flex-shrink-0" />{r.change}</div>
            <div className="col-span-12 sm:col-span-3 font-mono-a text-xs text-stone-500">{r.doc}</div>
          </div>
        ))}
      </div>
    </SectionA>
  );
}

function HearingA() {
  return (
    <SectionA title="The hearing" mono="03">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="border border-stone-900 bg-[#0A1628] text-[#F5F0E6] p-6 rounded-sm">
            <div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-[#C8501F] mb-3">Planning Commission</div>
            <div className="font-display-a text-3xl mb-1">Oct 14, 2026</div>
            <div className="text-stone-300 mb-6">6:30 PM · Cherrywood City Hall</div>
            <button className="w-full bg-[#C8501F] text-[#0A1628] font-semibold py-3 rounded-sm flex items-center justify-center gap-2 text-sm hover:bg-[#F5F0E6] min-h-[44px]"><Calendar className="w-4 h-4" /> RSVP to attend</button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="space-y-3">
            {[
              { icon: MessageSquare, t: 'Submit a comment to the Commission', s: 'Your comment becomes part of the official record.' },
              { icon: Mail, t: 'Email your councilmember', s: 'Find your district and pre-fill an editable message.' },
              { icon: FileText, t: 'Add your name to the public record', s: 'Letters of support are submitted to City Council.' }
            ].map((a,i)=>(
              <button key={i} className="w-full text-left border border-stone-300 bg-white/40 p-5 rounded-sm flex items-start gap-4 hover:bg-white/70 hover:border-[#C8501F] group min-h-[44px]">
                <div className="w-10 h-10 bg-[#0A1628] flex items-center justify-center rounded-sm flex-shrink-0 group-hover:bg-[#C8501F]"><a.icon className="w-4 h-4 text-[#F5F0E6]" /></div>
                <div className="flex-1"><div className="font-display-a text-lg text-stone-900 mb-1">{a.t}</div><p className="text-sm text-stone-600 leading-snug">{a.s}</p></div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#C8501F] mt-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionA>
  );
}

function FAQA() {
  return (
    <SectionA title="Common questions" mono="04">
      <div className="grid grid-cols-12 gap-x-8 gap-y-6">
        {[
          ['Who\u2019s behind this project?',  'Meridian Development Partners, working with Lattice Public Affairs.'],
          ['Is this a city website?',           'No. This is an applicant-run project site. Official city info is at cherrywood.gov.'],
          ['How will my comment be used?',      'Comments are clustered weekly and reflected in the "How we\u2019re listening" matrix.'],
          ['What happens at the hearing?',      'Planning Commission recommends; City Council holds the final vote.']
        ].map(([q,a],i)=>(
          <div key={i} className="col-span-12 md:col-span-6">
            <div className="font-display-a text-lg text-stone-900 mb-2">{q}</div>
            <p className="text-sm text-stone-700 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </SectionA>
  );
}

function FooterA() {
  return (
    <footer className="border-t border-stone-300 bg-[#0A1628] text-[#F5F0E6] mt-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 lg:col-span-6">
            <div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-[#C8501F] mb-3">Disclosure</div>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
              This website is paid for by <strong className="text-[#F5F0E6]">{PROJECT.applicant}</strong> and produced with <strong className="text-[#F5F0E6]">{PROJECT.firm}</strong>. It is not an official communication of the City of Cherrywood. Official city information is at <span className="underline">cherrywood.gov</span>.
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3"><div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">Project</div><ul className="text-sm text-stone-300 space-y-2"><li>Documents</li><li>Hearing schedule</li><li>FAQ</li><li>Contact</li></ul></div>
          <div className="col-span-6 lg:col-span-3"><div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">Accessibility</div><ul className="text-sm text-stone-300 space-y-2"><li>WCAG 2.1 AA</li><li>Translate</li><li>Comment policy</li><li>Privacy</li></ul></div>
        </div>
      </div>
    </footer>
  );
}

/* --- Style A internal (dark ops console) -------------------------------- */

function StyleAInternal({ phase }) {
  return (
    <div className="bg-[#0A1628] text-stone-100 min-h-screen grain-dark">
      <DashHeaderA phase={phase} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16 grid grid-cols-12 gap-4">
        <ScoreboardA />
        <ClusterA />
        <HeatmapA />
        <ResponseQueueA />
        <CouncilA />
        <InsightsA />
      </div>
      <FooterAInternal />
    </div>
  );
}

function DashHeaderA({ phase }) {
  return (
    <div className="border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-[#C8501F] mb-1">Engagement Operations — {PROJECT.applicant} × {PROJECT.firm}</div>
          <div className="font-display-a text-3xl text-[#F5F0E6]">{PROJECT.name}</div>
          <div className="font-mono-a text-xs text-stone-400 mt-1">{PROJECT.location} · Phase 0{phase} · Hearing in 47 days</div>
        </div>
        <div className="border border-white/10 px-3 py-2 rounded-sm w-fit">
          <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500">Status</div>
          <div className="text-sm flex items-center gap-1.5 text-[#C8501F]"><Activity className="w-3 h-3" /> Active</div>
        </div>
      </div>
    </div>
  );
}

function ScoreboardA() {
  const items = [
    { l: 'Comments',       v: PROJECT.stats.comments, sub: '+47 / 7d',         trend: 'up' },
    { l: 'Supporters',     v: PROJECT.stats.supporters, sub: '63% of base',    trend: 'up' },
    { l: 'Opposition',     v: PROJECT.stats.opposed,   sub: '25% of base',     trend: 'flat' },
    { l: 'Movable middle', v: PROJECT.stats.movable,   sub: 'Priority',        trend: 'up' },
    { l: 'Avg sentiment',  v: '+0.18',                 sub: '+0.04 / 7d',      trend: 'up', mono: true },
    { l: 'Approval prob.', v: '72%',                   sub: 'Blended',         trend: 'up', mono: true, accent: true }
  ];
  return (
    <div className="col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 rounded-sm overflow-hidden mt-4">
      {items.map((it,i)=>(
        <div key={i} className="bg-[#0A1628] p-4">
          <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-1">{it.l}</div>
          <div className={`${it.mono?'font-mono-a':'font-display-a'} text-2xl ${it.accent?'text-[#C8501F]':'text-[#F5F0E6]'} mb-1`}>{it.v}</div>
          <div className="text-[11px] text-stone-400 flex items-center gap-1">
            {it.trend==='up' && <TrendingUp className="w-3 h-3 text-[#9BC994]" />}
            {it.trend==='flat' && <Minus className="w-3 h-3 text-stone-500" />}
            {it.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

const DashPanelA = ({ title, mono, span = 12, icon: Icon, action, children }) => (
  <div className={`col-span-12 lg:col-span-${span} border border-white/10 rounded-sm bg-white/[0.02]`}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 gap-2">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-[#C8501F]" />}
        <div className="font-mono-a text-[10px] uppercase tracking-[0.22em] text-stone-500">{mono}</div>
        <div className="font-display-a text-base text-[#F5F0E6]">{title}</div>
      </div>
      {action}
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

function ClusterA() {
  const data = CLUSTERS.map(c => ({ ...c, x: Math.round(c.sentiment*100), y: c.count, z: c.count }));
  return (
    <DashPanelA title="Comment clusters" mono="01" icon={Layers} span={7} action={<span className="font-mono-a text-[10px] text-stone-500">BERTopic</span>}>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <XAxis type="number" dataKey="x" domain={[-60, 80]} tick={{ fill: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              label={{ value: '← negative   sentiment   positive →', position: 'bottom', fill: '#888', fontSize: 10 }} stroke="rgba(255,255,255,0.15)" />
            <YAxis type="number" dataKey="y" tick={{ fill: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' }} stroke="rgba(255,255,255,0.15)" />
            <ZAxis type="number" dataKey="z" range={[400, 2200]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.2)', fontSize: 12, color: '#F5F0E6' }}
              formatter={(v,n,p)=>[p.payload.theme + ' · ' + p.payload.count + ' comments', null]} />
            <Scatter data={data}>{data.map((d,i)=>(<Cell key={i} fill={d.sentiment>0?'#9BC994':d.sentiment<-0.3?'#E08C80':'#C8501F'} fillOpacity={0.85} />))}</Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </DashPanelA>
  );
}

function HeatmapA() {
  function color(v) {
    if (v === null) return '#C8501F';
    if (v > 0.6)  return '#A52A2A';
    if (v > 0.45) return '#C25C3F';
    if (v > 0.3)  return '#D89B6E';
    if (v > 0.18) return '#7A6B5C';
    return '#3A4357';
  }
  return (
    <DashPanelA title="Opposition heatmap" mono="02" icon={Target} span={5} action={<span className="font-mono-a text-[10px] text-stone-500">Heuristic</span>}>
      <div className="grid gap-1 mb-3" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
        {HEAT_GRID.flat().map((v,i)=>(
          <div key={i} title={v===null?'PROJECT SITE':`Opposition: ${(v*100).toFixed(0)}%`}
            className="aspect-square rounded-sm flex items-center justify-center text-[8px] font-mono-a"
            style={{ background: color(v), color: v===null?'#0A1628':'rgba(255,255,255,0.25)' }}>{v===null?'SITE':''}</div>
        ))}
      </div>
      <div className="flex items-center justify-between font-mono-a text-[10px] uppercase tracking-[0.18em] text-stone-500">
        <span>Low</span>
        <div className="flex gap-px flex-1 mx-3">{['#3A4357','#7A6B5C','#D89B6E','#C25C3F','#A52A2A'].map((c,i)=>(<div key={i} className="h-2 flex-1" style={{ background: c }} />))}</div>
        <span>High</span>
      </div>
      <div className="mt-4 p-3 border-l-2 border-[#C8501F] bg-white/[0.03]">
        <div className="text-[11px] text-stone-400 leading-relaxed"><strong className="text-[#F5F0E6]">Action:</strong> Highest-opposition blocks overlap with the Linden Park HOA. Schedule door-knocks next week. <span className="font-mono-a text-[10px] text-stone-500">Directional only.</span></div>
      </div>
    </DashPanelA>
  );
}

function ResponseQueueA() {
  return (
    <DashPanelA title="AI response queue" mono="03" icon={ClipboardCheck} span={7} action={<span className="font-mono-a text-[10px] text-stone-500">Human-in-the-loop</span>}>
      <div className="space-y-3">
        {RESPONSE_QUEUE.map(r=>(
          <div key={r.id} className="border border-white/10 bg-[#0A1628] p-4 rounded-sm">
            <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-3"><span className="font-mono-a text-[10px] text-stone-500">{r.id}</span><span className="font-mono-a text-[10px] uppercase tracking-[0.18em] text-[#C8501F]">{r.theme}</span></div>
              <span className={`font-mono-a text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-[0.16em] ${r.status==='awaiting_approval'?'bg-[#C8501F]/15 text-[#C8501F]':'bg-[#E08C80]/15 text-[#E08C80]'}`}>{r.status==='awaiting_approval'?'Awaiting approval':'Flagged'}</span>
            </div>
            <div className="text-[12px] text-stone-400 italic mb-2 leading-snug">&ldquo;{r.excerpt}&rdquo;</div>
            <div className="text-sm text-stone-200 leading-relaxed mb-3">{r.draft}</div>
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-2">
              <div className="flex items-center gap-3 font-mono-a text-[10px] text-stone-500"><span>Cite: {r.citation}</span><span>·</span><span>Conf: {(r.score*100).toFixed(0)}%</span></div>
              <div className="flex gap-2">
                <button className="text-[11px] px-3 py-2 border border-white/10 rounded-sm hover:bg-white/5 min-h-[40px]">Edit</button>
                <button className="text-[11px] px-3 py-2 border border-white/10 rounded-sm hover:bg-white/5 min-h-[40px]">Reject</button>
                <button className="text-[11px] px-3 py-2 bg-[#C8501F] text-[#0A1628] rounded-sm font-semibold flex items-center gap-1 min-h-[40px]"><Check className="w-3 h-3" /> Approve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashPanelA>
  );
}

function CouncilA() {
  const sc = { Support: { bg: 'rgba(155,201,148,0.12)', dot: '#9BC994', text: '#9BC994' },
               Movable: { bg: 'rgba(200,80,31,0.12)', dot: '#C8501F', text: '#C8501F' },
               Oppose:  { bg: 'rgba(224,140,128,0.12)', dot: '#E08C80', text: '#E08C80' } };
  return (
    <DashPanelA title="Council tracker" mono="04" icon={Users} span={5} action={<span className="font-mono-a text-[10px] text-stone-500">4 votes to pass</span>}>
      <div className="space-y-2">
        {COUNCIL.map((c,i)=>{const s=sc[c.stance];return(
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-sm" style={{ background: s.bg }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2"><div className="text-sm text-stone-100 font-medium">{c.name}</div><div className="font-mono-a text-[10px] text-stone-500">{c.district}</div></div>
              <div className="text-[11px] text-stone-400 truncate">{c.note}</div>
            </div>
            <div className="font-mono-a text-[10px] uppercase tracking-[0.18em] flex-shrink-0" style={{ color: s.text }}>{c.stance}</div>
          </div>
        )})}
      </div>
    </DashPanelA>
  );
}

function InsightsA() {
  const items = [
    { n: '01', t: 'Parking is the new dominant concern', b: 'Parking surpassed Building Height (+34%). Front-load the response.' },
    { n: '02', t: 'District 2 movement detected', b: 'Whitfield mentioned the project favorably at last night\u2019s HOA. Suggest one-on-one.' },
    { n: '03', t: 'Letter-of-support template flagged', b: '22% verbatim submissions. Diversify into 3 variants.' }
  ];
  return (
    <DashPanelA title="AI insights · today" mono="05" icon={Sparkles} span={12} action={<span className="font-mono-a text-[10px] text-stone-500">Awaiting review</span>}>
      <div className="grid grid-cols-12 gap-4">
        {items.map((it,i)=>(
          <div key={i} className="col-span-12 md:col-span-4 p-4 border border-white/10 bg-[#0A1628]">
            <div className="flex items-center gap-2 mb-3"><span className="font-mono-a text-[10px] text-[#C8501F]">{it.n}</span><span className="h-px flex-1 bg-white/10" /></div>
            <div className="font-display-a text-base text-[#F5F0E6] mb-2 leading-snug">{it.t}</div>
            <p className="text-[12px] text-stone-400 leading-relaxed">{it.b}</p>
          </div>
        ))}
      </div>
    </DashPanelA>
  );
}

function FooterAInternal() {
  return (
    <div className="border-t border-white/10 mt-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono-a text-[10px] uppercase tracking-[0.22em] text-stone-500 gap-2">
        <div>Restricted · Lattice Public Affairs · {PROJECT.applicant}</div>
        <div>All AI outputs require human approval before publication</div>
      </div>
    </div>
  );
}

/* ============================================================
   ============================================================
   STYLE B — ACCESSIBLE CIVIC
   Atkinson Hyperlegible + Public Sans, light theme, larger type,
   plain English, light internal dashboard, icon+label everywhere
   ============================================================
   ============================================================ */

// Color tokens for Style B
const B = {
  bg: '#FFFFFF',
  surface: '#F5F7FA',
  border: '#D1D5DB',
  borderStrong: '#9CA3AF',
  text: '#1B2434',
  textMuted: '#4B5563',
  heading: '#003D6B',
  primary: '#0050B4',
  primaryDark: '#003D6B',
  success: '#1F7A3D',
  successBg: '#E8F5ED',
  warning: '#C2410C',
  warningBg: '#FEF1E6',
  concern: '#B91C1C',
  concernBg: '#FDECEC',
  movable: '#7C5800',
  movableBg: '#FEF9E6'
};

function StyleBPublic({ phase }) {
  return (
    <div className="min-h-screen" style={{ background: B.bg, color: B.text, fontSize: '17px' }}>
      <HeroB phase={phase} />
      <TimelineB phase={phase} />
      {phase === 1 && <><VisionB /><DocLibraryB compact /><FAQB /></>}
      {phase === 2 && <><DocLibraryB /><MapB /><CommentsB /><ResponsivenessB compact /></>}
      {phase === 3 && <><ResponsivenessB /><HearingB /><DocLibraryB compact /></>}
      <FooterB />
    </div>
  );
}

const SectionB = ({ title, kicker, children, intro }) => (
  <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
    {kicker && <div className="font-display-b text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: B.primary }}>{kicker}</div>}
    <h2 className="font-display-b text-3xl sm:text-4xl font-bold leading-tight mb-3" style={{ color: B.heading }}>{title}</h2>
    {intro && <p className="text-lg max-w-2xl mb-8 leading-relaxed" style={{ color: B.textMuted }}>{intro}</p>}
    {!intro && <div className="h-1 w-16 mb-8 rounded-full" style={{ background: B.primary }} />}
    {children}
  </section>
);

function HeroB({ phase }) {
  const data = {
    1: { kicker: 'Phase 1 of 3', heading: 'A new neighborhood for Cherrywood.', cta: { label: 'Sign up for updates', icon: Mail } },
    2: { kicker: 'Phase 2 of 3 · Now collecting input', heading: 'Your input is shaping this plan.', cta: { label: 'Share your input', icon: MessageSquare } },
    3: { kicker: 'Phase 3 of 3 · Hearing on October 14', heading: 'Here is what changed because of your feedback.', cta: { label: 'RSVP to the public hearing', icon: Calendar } }
  };
  const d = data[phase];
  const Cta = d.cta.icon;
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
      <div className="grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 lg:col-span-7">
          <div className="font-display-b text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: B.primary }}>{d.kicker}</div>
          <h1 className="font-display-b text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4" style={{ color: B.heading }}>{PROJECT.name}</h1>
          <p className="text-xl sm:text-2xl leading-snug mb-6" style={{ color: B.text }}>{d.heading}</p>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: B.textMuted }}>{PROJECT.description}</p>
          <div className="flex flex-wrap gap-3">
            <BBtn primary icon={Cta}>{d.cta.label}</BBtn>
            <BBtn icon={FileText}>Read the full plan</BBtn>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-lg border-2 p-6" style={{ borderColor: B.border, background: B.surface }}>
            <div className="font-display-b text-base font-semibold mb-4" style={{ color: B.heading }}>Project at a glance</div>
            <dl className="space-y-3">
              <BFact label="Site size">{PROJECT.parcels}</BFact>
              <BFact label="Current zoning">{PROJECT.zoning.current}</BFact>
              <BFact label="Proposed zoning">{PROJECT.zoning.proposed}</BFact>
              <BFact label="Hearing date">{PROJECT.hearing}</BFact>
              <BFact label="Comments received">{PROJECT.stats.comments.toLocaleString()} from neighbors</BFact>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

const BFact = ({ label, children }) => (
  <div className="flex justify-between items-baseline gap-4 pb-3 border-b last:border-b-0 last:pb-0" style={{ borderColor: B.border }}>
    <dt className="text-base" style={{ color: B.textMuted }}>{label}</dt>
    <dd className="text-base font-semibold text-right" style={{ color: B.text }}>{children}</dd>
  </div>
);

function BBtn({ primary, icon: Icon, children, onClick, fullWidth }) {
  const style = primary
    ? { background: B.primary, color: '#fff', borderColor: B.primary }
    : { background: '#fff', color: B.primary, borderColor: B.primary };
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border-2 text-base font-semibold transition-colors hover:opacity-90 ${fullWidth?'w-full':''}`}
      style={{ ...style, minHeight: 48 }}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}

function TimelineB({ phase }) {
  const activeIdx = PHASE_TO_STEP[phase];
  return (
    <section className="border-y" style={{ background: B.surface, borderColor: B.border }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="font-display-b text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: B.primary }}>Where we are in the process</div>
        {/* Desktop horizontal */}
        <ol className="hidden md:grid grid-cols-6 gap-2">
          {PROCESS.map((s, i) => {
            const done = i < activeIdx, here = i === activeIdx;
            const dotBg = here ? B.primary : done ? B.heading : '#fff';
            const dotBorder = here ? B.primary : done ? B.heading : B.borderStrong;
            return (
              <li key={s.key} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-display-b font-bold text-sm ${here?'ring-4':''}`}
                    style={{ background: dotBg, borderColor: dotBorder, color: (here||done)?'#fff':B.textMuted, '--tw-ring-color': here?'rgba(0,80,180,0.2)':'transparent' }}>
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                </div>
                <div className={`text-sm ${here?'font-bold':'font-medium'}`} style={{ color: here?B.heading:done?B.text:B.textMuted }}>{s.labelB}</div>
                {here && <div className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded" style={{ background: B.primary, color: '#fff' }}>Current step</div>}
              </li>
            );
          })}
        </ol>
        {/* Mobile vertical */}
        <ol className="md:hidden space-y-3">
          {PROCESS.map((s, i) => {
            const done = i < activeIdx, here = i === activeIdx;
            const dotBg = here ? B.primary : done ? B.heading : '#fff';
            const dotBorder = here ? B.primary : done ? B.heading : B.borderStrong;
            return (
              <li key={s.key} className="flex items-center gap-3 p-3 rounded-md" style={{ background: here ? '#fff' : 'transparent', border: here?`2px solid ${B.primary}`:'none' }}>
                <span className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-display-b font-bold text-sm flex-shrink-0"
                  style={{ background: dotBg, borderColor: dotBorder, color: (here||done)?'#fff':B.textMuted }}>
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className="text-base flex-1" style={{ color: here?B.heading:done?B.text:B.textMuted, fontWeight: here?700:500 }}>{s.labelB}</span>
                {here && <span className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0" style={{ background: B.primary, color: '#fff' }}>Current</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function VisionB() {
  const items = [
    { icon: Home, t: '240 homes', s: 'Including 28 deed-restricted affordable apartments for households earning up to 80% of the area median income.' },
    { icon: Briefcase, t: '18,000 sq ft of shops', s: 'Ground-floor neighborhood retail — a café, market, and everyday services within walking distance.' },
    { icon: Trees, t: '1.2-acre public plaza', s: 'Permanently dedicated open space with a farmers-market easement and a maintenance endowment.' }
  ];
  return (
    <SectionB kicker="What’s being proposed" title="What we want to build" intro="Three components, all designed to fit the character of the Linden Avenue corridor.">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {items.map((c, i) => (
          <article key={i} className="col-span-12 md:col-span-4 rounded-lg border-2 p-6" style={{ borderColor: B.border, background: B.bg }}>
            <div className="w-12 h-12 rounded-md flex items-center justify-center mb-4" style={{ background: B.successBg }}>
              <c.icon className="w-6 h-6" style={{ color: B.success }} />
            </div>
            <h3 className="font-display-b font-bold text-xl mb-2" style={{ color: B.heading }}>{c.t}</h3>
            <p className="leading-relaxed" style={{ color: B.text }}>{c.s}</p>
          </article>
        ))}
      </div>
    </SectionB>
  );
}

function DocLibraryB({ compact }) {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState(null);
  return (
    <SectionB kicker="Documents & answers" title="Have a question? Ask the project documents." intro="Type any question. Every answer links back to the document it came from — the Comprehensive Plan, the Zoning Code, or the project’s own filings.">
      <div className="rounded-lg border-2 mb-3 flex items-stretch" style={{ borderColor: B.borderStrong, background: B.bg }}>
        <div className="flex items-center pl-4"><Search className="w-5 h-5" style={{ color: B.textMuted }} /></div>
        <input value={q} onChange={(e)=>setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && q && setAnswer({ q, ...lookupAnswer(q) })}
          placeholder="Try: How tall will the building be?"
          className="flex-1 px-3 py-3 text-base outline-none bg-transparent min-w-0"
          style={{ color: B.text }} />
        <button onClick={()=>q && setAnswer({ q, ...lookupAnswer(q) })}
          className="px-5 m-1 rounded-md font-semibold text-base flex items-center gap-2"
          style={{ background: B.primary, color: '#fff', minHeight: 48 }}>
          <Sparkles className="w-4 h-4" /> Ask
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: B.textMuted }}>
        <Shield className="w-4 h-4 flex-shrink-0" />
        <span>Every answer cites a source. We do not generate zoning or legal claims.</span>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <div className="font-semibold mb-2" style={{ color: B.heading }}>Common questions:</div>
          <div className="space-y-2">
            {[
              { label: 'How tall will the building be?', term: 'height' },
              { label: 'Will there be enough parking?',  term: 'parking' },
              { label: 'How much is affordable housing?',term: 'affordable' }
            ].map((opt) => (
              <button key={opt.term}
                onClick={() => { setQ(opt.label); setAnswer({ q: opt.label, ...lookupAnswer(opt.term) }); }}
                className="block w-full text-left px-4 py-3 rounded-md border-2 text-base hover:bg-gray-50 transition-colors"
                style={{ borderColor: B.border, color: B.text, minHeight: 48 }}>
                <span className="underline" style={{ color: B.primary, textDecorationColor: B.primary }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {answer ? (
            <div className="rounded-lg border-2 p-6" style={{ borderColor: B.success, background: B.successBg }}>
              <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: B.success }}>Answer</div>
              <h3 className="font-display-b font-bold text-xl mb-3" style={{ color: B.heading }}>{answer.q}</h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: B.text }}>{answer.text}</p>
              <div className="pt-4 border-t" style={{ borderColor: B.border }}>
                <div className="text-sm font-semibold mb-2" style={{ color: B.heading }}>Sources:</div>
                <ul className="space-y-1.5">
                  {answer.citations.map((c, i) => (
                    <li key={i} className="text-base flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: B.primary }} />
                      <span><strong>{c.doc}</strong>, {c.loc} <span className="underline cursor-pointer" style={{ color: B.primary }}>(open)</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-8 text-center" style={{ borderColor: B.border, color: B.textMuted }}>
              <Search className="w-8 h-8 mx-auto mb-3" style={{ color: B.textMuted }} />
              Pick a common question on the left, or type your own above.
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-8">
          <div className="font-semibold mb-3" style={{ color: B.heading }}>Or browse the documents directly:</div>
          <div className="grid grid-cols-12 gap-3">
            {['Site Plan (Aug 2026)','Traffic Impact Analysis','Comprehensive Plan §4','Zoning Code MX-3','Landscape & Tree Plan','Wildlife Corridor Assessment'].map((d) => (
              <a key={d} className="col-span-12 md:col-span-6 lg:col-span-4 rounded-md border-2 px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                style={{ borderColor: B.border, minHeight: 48 }}>
                <span className="flex items-center gap-3"><FileText className="w-5 h-5" style={{ color: B.primary }} /><span className="text-base">{d}</span></span>
                <ArrowUpRight className="w-4 h-4" style={{ color: B.textMuted }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </SectionB>
  );
}

function MapB() {
  const [pins, setPins] = useState([
    { x: 240, y: 180, label: 'Traffic concern' },
    { x: 320, y: 240, label: 'I love the plaza idea' },
    { x: 180, y: 260, label: 'Building is too tall here' }
  ]);
  function dropPin(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 600 / rect.width, scaleY = 360 / rect.height;
    setPins([...pins, { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY, label: 'New comment' }]);
  }
  return (
    <SectionB kicker="Tell us about a place" title="Drop a pin on the map" intro="Click anywhere on the map to leave a comment about that specific spot. Your pin and note will be sent to the project team and reviewed every week.">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div onClick={dropPin} className="relative rounded-lg overflow-hidden cursor-crosshair border-2" style={{ aspectRatio: '4/2.4', borderColor: B.borderStrong, background: '#E8EEF3' }}>
            <svg viewBox="0 0 600 360" className="w-full h-full">
              <defs><pattern id="streetsB" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 0 30 H 60 M 30 0 V 60" stroke="rgba(0,0,0,0.1)" strokeWidth="1" /></pattern></defs>
              <rect width="600" height="360" fill="url(#streetsB)" />
              {[[60,60,80,60,'#D1DCE5'],[160,60,80,60,'#D1DCE5'],[260,60,80,60,'#D1DCE5'],[360,60,80,60,'#D1DCE5'],[460,60,80,60,'#D1DCE5'],
                [60,140,80,60,'#D1DCE5'],[160,140,80,60,'#D1DCE5'],[260,140,80,80,'#0050B4'],[360,140,80,60,'#D1DCE5'],[460,140,80,60,'#D1DCE5'],
                [60,240,80,60,'#D1DCE5'],[160,240,80,60,'#D1DCE5'],[260,240,80,60,'#D1DCE5'],[360,240,80,60,'#D1DCE5'],[460,240,80,60,'#D1DCE5']
              ].map(([x,y,w,h,c],i)=>(<rect key={i} x={x} y={y} width={w} height={h} fill={c} stroke="rgba(0,0,0,0.1)" />))}
              <text x={300} y={185} textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Public Sans" fontWeight="700">Project Site</text>
              <text x={300} y={203} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Public Sans" opacity="0.85">12.4 acres</text>
              {pins.map((p,i)=>(<g key={i}><circle cx={p.x} cy={p.y} r="8" fill="#fff" stroke="#003D6B" strokeWidth="2" /><circle cx={p.x} cy={p.y} r="3" fill="#B91C1C" /></g>))}
            </svg>
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md text-sm font-semibold" style={{ background: '#fff', color: B.heading }}>Tap anywhere to drop a pin</div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="font-semibold mb-3" style={{ color: B.heading }}>Recent pins ({pins.length})</div>
          <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {pins.slice().reverse().map((p,i)=>(
              <li key={i} className="rounded-md border-2 p-3 flex gap-3 items-start" style={{ borderColor: B.border, background: B.bg }}>
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: B.concern }} />
                <span className="text-base" style={{ color: B.text }}>{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionB>
  );
}

function CommentsB() {
  return (
    <SectionB kicker="Public comment" title="Share your thoughts on the project" intro="Comments are reviewed every week. Your name and ZIP code help us verify you live or work nearby — and ensure your voice is part of the official record.">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <form className="rounded-lg border-2 p-6 space-y-4" style={{ borderColor: B.border, background: B.surface }}>
            <BField label="First name (required)"><input className="w-full px-3 py-3 text-base rounded-md border-2 outline-none" style={{ borderColor: B.borderStrong, minHeight: 48 }} /></BField>
            <BField label="Last initial"><input maxLength={1} className="w-full px-3 py-3 text-base rounded-md border-2 outline-none" style={{ borderColor: B.borderStrong, minHeight: 48 }} /></BField>
            <BField label="ZIP code (required)" hint="We use your ZIP to confirm you live or work nearby. It is not shared publicly."><input className="w-full px-3 py-3 text-base rounded-md border-2 outline-none" style={{ borderColor: B.borderStrong, minHeight: 48 }} /></BField>
            <BField label="Your comment" hint="What would you like the project team to know? Be specific.">
              <textarea rows={6} className="w-full px-3 py-3 text-base rounded-md border-2 outline-none resize-none" style={{ borderColor: B.borderStrong }} />
            </BField>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: B.textMuted }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: B.primary }} />Real-name policy. ZIP-verified. Spam filtered.
              </div>
              <BBtn primary icon={Send}>Submit comment</BBtn>
            </div>
          </form>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="font-semibold mb-3" style={{ color: B.heading }}>What your neighbors are saying:</div>
          <ul className="space-y-3">
            {RECENT_COMMENTS.map((c,i) => {
              const stance = c.stance === 'support' ? { bg: B.successBg, c: B.success, l: 'Supports' }
                : c.stance === 'oppose' ? { bg: B.concernBg, c: B.concern, l: 'Has concerns' }
                : { bg: B.movableBg, c: B.movable, l: 'Open' };
              return (
                <li key={i} className="rounded-md border-l-4 p-4" style={{ borderLeftColor: stance.c, background: stance.bg }}>
                  <div className="text-base mb-2 leading-snug" style={{ color: B.text }}>&ldquo;{c.text}&rdquo;</div>
                  <div className="text-sm flex items-center gap-2" style={{ color: B.textMuted }}>
                    <span className="font-semibold" style={{ color: stance.c }}>{stance.l}</span>
                    <span>·</span><span>{c.name}</span><span>·</span><span>{c.zip}</span><span>·</span><span>{c.tag}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionB>
  );
}

const BField = ({ label, hint, children }) => (
  <div>
    <label className="block font-semibold text-base mb-1" style={{ color: B.heading }}>{label}</label>
    {hint && <p className="text-sm mb-2" style={{ color: B.textMuted }}>{hint}</p>}
    {children}
  </div>
);

function ResponsivenessB({ compact }) {
  return (
    <SectionB kicker="How we’re listening" title="What changed because of your feedback" intro="Every concern raised on this site is tagged and reviewed weekly. Here is what changed in the plan, and which city document supports the change.">
      <div className="rounded-lg border-2 overflow-hidden" style={{ borderColor: B.border, background: B.bg }}>
        {/* Desktop table */}
        <table className="hidden md:table w-full">
          <thead>
            <tr style={{ background: B.surface }}>
              <th className="text-left px-5 py-3 font-display-b text-sm font-bold uppercase tracking-wider" style={{ color: B.heading }}>You said</th>
              <th className="text-left px-5 py-3 font-display-b text-sm font-bold uppercase tracking-wider" style={{ color: B.heading }}>We changed</th>
              <th className="text-left px-5 py-3 font-display-b text-sm font-bold uppercase tracking-wider" style={{ color: B.heading }}>Document</th>
            </tr>
          </thead>
          <tbody>
            {RESPONSIVENESS.map((r,i) => (
              <tr key={i} className="border-t" style={{ borderColor: B.border }}>
                <td className="px-5 py-4 text-base align-top" style={{ color: B.textMuted }}>{r.concern}</td>
                <td className="px-5 py-4 text-base align-top">
                  <div className="flex items-start gap-2"><Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: B.success }} /><span style={{ color: B.text }}>{r.change}</span></div>
                </td>
                <td className="px-5 py-4 text-base align-top">
                  <a className="underline" style={{ color: B.primary }}>{r.doc}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile stacked cards */}
        <ul className="md:hidden divide-y" style={{ borderColor: B.border }}>
          {RESPONSIVENESS.map((r,i) => (
            <li key={i} className="p-4" style={{ borderColor: B.border }}>
              <div className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: B.primary }}>You said</div>
              <p className="text-base mb-3" style={{ color: B.textMuted }}>{r.concern}</p>
              <div className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: B.success }}>We changed</div>
              <div className="flex items-start gap-2 mb-3"><Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: B.success }} /><span className="text-base" style={{ color: B.text }}>{r.change}</span></div>
              <div className="text-sm" style={{ color: B.textMuted }}>Source: <a className="underline font-semibold" style={{ color: B.primary }}>{r.doc}</a></div>
            </li>
          ))}
        </ul>
      </div>
    </SectionB>
  );
}

function HearingB() {
  return (
    <SectionB kicker="Public hearing" title="Be part of the decision" intro="The Planning Commission will hold a public hearing where they review the project and make a recommendation to City Council. Here is how you can be involved.">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-lg p-6 text-center" style={{ background: B.heading, color: '#fff' }}>
            <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: '#fff' }} />
            <div className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">Planning Commission Hearing</div>
            <div className="font-display-b text-4xl font-bold mb-2">October 14, 2026</div>
            <div className="text-lg mb-1">6:30 PM</div>
            <div className="text-base opacity-80 mb-6">Cherrywood City Hall, Council Chambers</div>
            <button className="w-full bg-white rounded-md py-3 text-base font-semibold flex items-center justify-center gap-2" style={{ color: B.heading, minHeight: 48 }}>
              <Calendar className="w-5 h-5" /> RSVP to attend
            </button>
            <p className="text-sm mt-3 opacity-80">In person or virtually via Zoom</p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 space-y-3">
          {[
            { icon: MessageSquare, t: 'Submit a written comment', s: 'Your comment becomes part of the official record reviewed by every commissioner.' },
            { icon: Mail, t: 'Email your councilmember', s: 'We will find your district based on your address and pre-fill an editable message.' },
            { icon: FileText, t: 'Add your name to the public record', s: 'Letters of support are submitted to City Council with verified ZIP codes.' }
          ].map((a,i) => (
            <button key={i} className="w-full text-left rounded-lg border-2 p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              style={{ borderColor: B.border, background: B.bg, minHeight: 48 }}>
              <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: B.successBg }}>
                <a.icon className="w-5 h-5" style={{ color: B.success }} />
              </div>
              <div className="flex-1">
                <div className="font-display-b font-bold text-lg mb-1" style={{ color: B.heading }}>{a.t}</div>
                <p className="text-base" style={{ color: B.text }}>{a.s}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 mt-1" style={{ color: B.primary }} />
            </button>
          ))}
        </div>
      </div>
    </SectionB>
  );
}

function FAQB() {
  const faqs = [
    ['Who is behind this project?',  'Meridian Development Partners is the applicant. They are working with Lattice Public Affairs to share information and gather community input. You can see the full disclosure at the bottom of every page.'],
    ['Is this an official city website?', 'No. This website is run by the applicant. It is not an official communication of the City of Cherrywood. For official city information, visit cherrywood.gov.'],
    ['How will my comment be used?',  'Every comment is reviewed weekly, tagged by topic, and shown in the "What changed because of your feedback" section above. Verified comments are also submitted to the public record before the hearing.'],
    ['What happens at the hearing?',  'The Planning Commission reviews the project and makes a recommendation. The City Council then holds the final vote.']
  ];
  return (
    <SectionB kicker="FAQ" title="Common questions" intro="If you don’t see your question here, send it to the project team and we will add it.">
      <div className="space-y-3">
        {faqs.map(([q, a], i) => (
          <details key={i} className="rounded-lg border-2 p-5 group" style={{ borderColor: B.border, background: B.bg }}>
            <summary className="font-display-b font-bold text-lg cursor-pointer flex items-center justify-between gap-3" style={{ color: B.heading }}>
              {q}
              <ChevronRight className="w-5 h-5 flex-shrink-0 group-open:rotate-90 transition-transform" style={{ color: B.primary }} />
            </summary>
            <p className="text-base mt-3 leading-relaxed" style={{ color: B.text }}>{a}</p>
          </details>
        ))}
      </div>
    </SectionB>
  );
}

function FooterB() {
  return (
    <footer className="border-t-4" style={{ borderColor: B.heading, background: B.surface }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: B.primary }}>Disclosure</div>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: B.text }}>
              This website is paid for by <strong>{PROJECT.applicant}</strong> and produced in partnership with <strong>{PROJECT.firm}</strong>. It is not an official communication of the City of Cherrywood. For official city information, please visit <a className="underline font-semibold" style={{ color: B.primary }}>cherrywood.gov</a>.
            </p>
            <p className="text-sm mt-3" style={{ color: B.textMuted }}>Need help reading this site? Call (303) 555-0140. Disponible en español.</p>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <div className="font-display-b font-bold mb-3" style={{ color: B.heading }}>Project</div>
            <ul className="space-y-2 text-base">
              {['Documents', 'Hearing schedule', 'FAQ', 'Contact the team'].map((l) => (
                <li key={l}><a className="underline" style={{ color: B.primary }}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <div className="font-display-b font-bold mb-3" style={{ color: B.heading }}>Accessibility</div>
            <ul className="space-y-2 text-base">
              {['WCAG 2.1 AA', 'Translate', 'Privacy'].map((l) => (
                <li key={l}><a className="underline" style={{ color: B.primary }}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   STYLE B — INTERNAL DASHBOARD (light theme, clear, table-first)
   ============================================================ */

function StyleBInternal({ phase }) {
  return (
    <div className="min-h-screen" style={{ background: B.surface, color: B.text, fontSize: '17px' }}>
      <DashHeaderB phase={phase} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 space-y-4">
        <ScoreboardB />
        <div className="grid grid-cols-12 gap-4">
          <ClusterB />
          <HeatmapB />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <ResponseQueueB />
          <CouncilB />
        </div>
        <InsightsB />
      </div>
      <FooterBInternal />
    </div>
  );
}

function DashHeaderB({ phase }) {
  return (
    <div className="border-b-4" style={{ borderColor: B.heading, background: B.bg }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: B.primary }}>Internal · {PROJECT.applicant} × {PROJECT.firm}</div>
            <h1 className="font-display-b text-3xl sm:text-4xl font-bold" style={{ color: B.heading }}>{PROJECT.name}</h1>
            <p className="text-base mt-1" style={{ color: B.textMuted }}>
              {PROJECT.location} · <strong style={{ color: B.text }}>Phase {phase} of 3</strong> · <strong style={{ color: B.concern }}>Hearing in 47 days</strong>
            </p>
          </div>
          <div className="rounded-md border-2 px-4 py-3 inline-flex flex-col" style={{ borderColor: B.success, background: B.successBg }}>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: B.success }}>Campaign status</span>
            <span className="text-lg font-bold flex items-center gap-2 mt-1" style={{ color: B.success }}><Activity className="w-4 h-4" />Active &amp; on track</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreboardB() {
  const items = [
    { l: 'Total comments',      v: PROJECT.stats.comments.toLocaleString(), sub: '+47 this week', trend: 'up' },
    { l: 'Verified supporters', v: PROJECT.stats.supporters.toLocaleString(), sub: '63% of base', trend: 'up', tone: 'success' },
    { l: 'Hard opposition',     v: PROJECT.stats.opposed,    sub: '25% of base', trend: 'flat', tone: 'concern' },
    { l: 'Movable middle',      v: PROJECT.stats.movable,    sub: 'Priority audience', trend: 'up', tone: 'warning' },
    { l: 'Avg sentiment',       v: '+0.18',                  sub: 'Up from +0.14', trend: 'up' },
    { l: 'Approval probability',v: '72%',                    sub: 'Commission + Council blended', trend: 'up', tone: 'primary' }
  ];
  const toneColor = { success: B.success, concern: B.concern, warning: B.warning, primary: B.primary };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border-2 p-4" style={{ borderColor: B.border, background: B.bg }}>
          <div className="text-sm font-semibold mb-1" style={{ color: B.textMuted }}>{it.l}</div>
          <div className="font-display-b text-3xl font-bold mb-1" style={{ color: it.tone ? toneColor[it.tone] : B.heading }}>{it.v}</div>
          <div className="text-xs flex items-center gap-1" style={{ color: B.textMuted }}>
            {it.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" style={{ color: B.success }} />}
            {it.trend === 'flat' && <Minus className="w-3.5 h-3.5" style={{ color: B.textMuted }} />}
            {it.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

const PanelB = ({ title, icon: Icon, action, span = 12, help, children }) => (
  <section className={`col-span-12 lg:col-span-${span} rounded-lg border-2`} style={{ borderColor: B.border, background: B.bg }}>
    <header className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b-2 gap-2" style={{ borderColor: B.border }}>
      <div className="flex items-center gap-3">
        {Icon && <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: B.successBg }}><Icon className="w-5 h-5" style={{ color: B.success }} /></div>}
        <div>
          <h2 className="font-display-b text-lg font-bold" style={{ color: B.heading }}>{title}</h2>
          {help && <p className="text-sm" style={{ color: B.textMuted }}>{help}</p>}
        </div>
      </div>
      {action}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

function ClusterB() {
  // Bar chart for readability (Style A used scatter; this is the accessibility move)
  const sorted = [...CLUSTERS].sort((a,b) => b.count - a.count);
  return (
    <PanelB title="Top concerns by volume" icon={BarChart3} span={7} help="Each bar is a topic our AI grouped from public comments. Color shows whether comments are mostly positive (green), mixed (blue), or negative (red).">
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 60, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tick={{ fill: B.textMuted, fontSize: 13, fontFamily: 'Public Sans' }} />
            <YAxis type="category" dataKey="theme" tick={{ fill: B.text, fontSize: 13, fontFamily: 'Public Sans' }} width={155} />
            <Tooltip
              contentStyle={{ background: '#fff', border: `2px solid ${B.border}`, borderRadius: 6, fontSize: 14, color: B.text }}
              formatter={(v, n, p) => [`${v} comments · sentiment ${p.payload.sentiment > 0 ? '+' : ''}${p.payload.sentiment.toFixed(2)}`, p.payload.theme]} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {sorted.map((d, i) => (
                <Cell key={i} fill={d.sentiment > 0 ? B.success : d.sentiment < -0.3 ? B.concern : B.primary} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: B.text, fontSize: 13, fontFamily: 'Public Sans', fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t" style={{ borderColor: B.border }}>
        <Legend color={B.success} label="Mostly positive" />
        <Legend color={B.primary} label="Mixed" />
        <Legend color={B.concern} label="Mostly negative" />
      </div>
    </PanelB>
  );
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2 text-sm" style={{ color: B.text }}>
    <span className="w-4 h-4 rounded-sm" style={{ background: color }} />
    {label}
  </div>
);

function HeatmapB() {
  function color(v) {
    if (v === null) return B.primary;
    if (v > 0.6) return '#991B1B';
    if (v > 0.45) return '#DC2626';
    if (v > 0.3) return '#F87171';
    if (v > 0.18) return '#FCA5A5';
    return '#FEE2E2';
  }
  return (
    <PanelB title="Likely opposition by neighborhood" icon={Target} span={5} help="Heuristic estimate based on homeowner density, voter turnout, and proximity. Use to prioritize door-knocking — not as a guarantee.">
      <div className="grid gap-1.5 mb-4" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
        {HEAT_GRID.flat().map((v, i) => (
          <div key={i} title={v === null ? 'PROJECT SITE' : `Opposition probability: ${(v * 100).toFixed(0)}%`}
            className="aspect-square rounded flex items-center justify-center font-display-b text-[10px] font-bold"
            style={{ background: color(v), color: v === null ? '#fff' : 'rgba(0,0,0,0.4)' }}>
            {v === null ? 'SITE' : ''}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm mb-4" style={{ color: B.textMuted }}>
        <span className="font-semibold">Lower opposition</span>
        <div className="flex gap-1 mx-3">
          {['#FEE2E2','#FCA5A5','#F87171','#DC2626','#991B1B'].map((c,i)=>(<div key={i} className="w-6 h-3 rounded" style={{ background: c }} />))}
        </div>
        <span className="font-semibold">Higher opposition</span>
      </div>
      <div className="rounded-md border-l-4 p-4" style={{ borderColor: B.warning, background: B.warningBg }}>
        <div className="font-display-b font-bold mb-1" style={{ color: B.warning }}>Recommended action</div>
        <p className="text-sm" style={{ color: B.text }}>The two darkest blocks (north and northeast of the site) overlap with the Linden Park HOA. <strong>Schedule door-knocks and a small-group session there next week.</strong> Treat this as directional, not a guarantee.</p>
      </div>
    </PanelB>
  );
}

function ResponseQueueB() {
  return (
    <PanelB title="AI-drafted responses awaiting your approval" icon={ClipboardCheck} span={7} help="Each response was drafted by AI based on real public comments and the project documents. Nothing is published until a team member approves it.">
      <ul className="space-y-3">
        {RESPONSE_QUEUE.map((r) => {
          const flagged = r.status === 'flagged_for_review';
          return (
            <li key={r.id} className="rounded-lg border-2 p-4" style={{ borderColor: flagged ? B.warning : B.border, background: flagged ? B.warningBg : B.surface }}>
              <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: B.heading }}>{r.theme}</span>
                  <span className="text-sm" style={{ color: B.textMuted }}>#{r.id}</span>
                </div>
                <span className="px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider" style={{ background: flagged ? B.warning : B.primary, color: '#fff' }}>
                  {flagged ? <><AlertTriangle className="w-3 h-3 inline mr-1" />Needs review</> : 'Awaiting approval'}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-sm font-semibold mb-1" style={{ color: B.textMuted }}>Original comment:</div>
                <p className="text-base italic" style={{ color: B.text }}>&ldquo;{r.excerpt}&rdquo;</p>
              </div>
              <div className="mb-3 pt-3 border-t" style={{ borderColor: B.border }}>
                <div className="text-sm font-semibold mb-1" style={{ color: B.textMuted }}>Proposed response:</div>
                <p className="text-base leading-relaxed" style={{ color: B.text }}>{r.draft}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: B.border }}>
                <div className="text-sm flex items-center gap-3" style={{ color: B.textMuted }}>
                  <span><FileText className="w-3.5 h-3.5 inline mr-1" />{r.citation}</span>
                  <span>·</span>
                  <span>AI confidence: <strong style={{ color: r.score > 0.8 ? B.success : B.warning }}>{(r.score * 100).toFixed(0)}%</strong></span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-2 rounded-md border-2 text-sm font-semibold flex items-center gap-1" style={{ borderColor: B.borderStrong, color: B.text, minHeight: 40 }}>Edit</button>
                  <button className="px-3 py-2 rounded-md border-2 text-sm font-semibold flex items-center gap-1" style={{ borderColor: B.concern, color: B.concern, minHeight: 40 }}><ThumbsDown className="w-3.5 h-3.5" />Reject</button>
                  <button className="px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1" style={{ background: B.success, color: '#fff', minHeight: 40 }}><Check className="w-3.5 h-3.5" />Approve &amp; publish</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </PanelB>
  );
}

function CouncilB() {
  const sc = {
    Support: { bg: B.successBg, c: B.success,   label: 'Supporting' },
    Movable: { bg: B.movableBg, c: B.movable,   label: 'Movable' },
    Oppose:  { bg: B.concernBg, c: B.concern,   label: 'Opposed' }
  };
  return (
    <PanelB title="City Council tracker" icon={Users} span={5} help="We need 4 of 7 votes to pass. Click a name to see contact log and notes.">
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {['Support','Movable','Oppose'].map((s) => {
          const cnt = COUNCIL.filter(c => c.stance === s).length;
          return (
            <div key={s} className="rounded-md p-3" style={{ background: sc[s].bg }}>
              <div className="font-display-b text-2xl font-bold" style={{ color: sc[s].c }}>{cnt}</div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: sc[s].c }}>{sc[s].label}</div>
            </div>
          );
        })}
      </div>
      <ul className="space-y-2">
        {COUNCIL.map((c, i) => {
          const s = sc[c.stance];
          return (
            <li key={i} className="rounded-md border-l-4 p-3" style={{ borderLeftColor: s.c, background: s.bg }}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-base" style={{ color: B.text }}>{c.name}</span>
                  <span className="text-xs font-mono-a" style={{ color: B.textMuted }}>{c.district}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: s.c }}>{s.label}</span>
              </div>
              <div className="text-sm" style={{ color: B.textMuted }}>{c.note}</div>
            </li>
          );
        })}
      </ul>
    </PanelB>
  );
}

function InsightsB() {
  const items = [
    { t: 'Parking is now the top concern', b: 'Parking surpassed Building Height this week, up 34% in volume. The Comp Plan and Zoning Code both support our position. We recommend front-loading the parking response in the next newsletter.', priority: 'High' },
    { t: 'District 2 may be moving toward support', b: 'Councilmember Whitfield (D2) spoke favorably about the project at last night\u2019s Linden Park HOA meeting. Tone shifted from skeptical to conditional. Suggest scheduling a one-on-one site walk before Sept 10.', priority: 'Medium' },
    { t: 'Letter-of-support template overused', b: '22% of supporters are submitting the template verbatim. Clerks notice this. We recommend diversifying the template into 3 variants and prompting for personal detail.', priority: 'Medium' }
  ];
  return (
    <PanelB title="What the AI noticed today" icon={Sparkles} help="A daily summary generated at 6:14 AM. Review these before sharing them with the wider team.">
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="rounded-lg border-2 p-4 flex flex-col md:flex-row md:items-start gap-4" style={{ borderColor: B.border, background: B.surface }}>
            <div className="flex items-center gap-3 md:flex-col md:items-start md:min-w-[120px]">
              <span className="font-display-b font-bold text-2xl" style={{ color: B.primary }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ background: it.priority === 'High' ? B.concernBg : B.warningBg, color: it.priority === 'High' ? B.concern : B.warning }}>{it.priority} priority</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display-b font-bold text-lg mb-2" style={{ color: B.heading }}>{it.t}</h3>
              <p className="text-base leading-relaxed" style={{ color: B.text }}>{it.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </PanelB>
  );
}

function FooterBInternal() {
  return (
    <div className="border-t-2 mt-4" style={{ borderColor: B.border, background: B.bg }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-sm" style={{ color: B.textMuted }}>
          <Lock className="w-4 h-4 inline mr-1" />Restricted view · {PROJECT.firm} · {PROJECT.applicant}
        </div>
        <div className="text-sm flex items-center gap-2" style={{ color: B.success }}>
          <Shield className="w-4 h-4" />All AI outputs require human approval before publication. Audit log enabled.
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ============================================================
   BUILDER CONSOLE — the platform owner's setup wizard
   Engineering-console aesthetic. Cyan accent. Dark.
   Sentry-like: feed in the project, watch it scaffold.
   ============================================================
   ============================================================ */

const CONSOLE = {
  bg: '#070A12',
  surface: '#0E1422',
  surfaceAlt: '#11182B',
  border: '#1F2A44',
  borderStrong: '#2C3A5C',
  text: '#E5E7EB',
  textMuted: '#8B95A8',
  textDim: '#5A6478',
  accent: '#5CFFB8',
  accentDim: '#3DCC92',
  warning: '#FFB85C',
  error: '#FF6B7A',
  primary: '#7CA8FF'
};

function BuilderConsole() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: 'Cherry Creek Commons',
    type: 'Rezoning',
    applicant: 'Meridian Development Partners',
    firm: 'Lattice Public Affairs',
    address: '4400 Linden Avenue, Cherrywood CO',
    parcelSize: '12.4 acres',
    city: 'Cherrywood, Colorado',
    compPlanIngested: false,
    zoningIngested: false,
    currentZoning: 'I-1 (Light Industrial)',
    proposedZoning: 'MX-3 (Mixed-Use, Mid-Rise)',
    submittal: '2026-07-15',
    referralEnd: '2026-09-12',
    hearing: '2026-10-14',
    council: '2026-11-04',
    councilCount: 7,
    knownOpposition: 'Linden Park HOA (northwest), Cherrywood Preservation Society',
    allied: 'Cherrywood Housing Trust, Downtown Business Alliance',
    aiRag: true,
    aiCluster: true,
    aiDrafts: true,
    aiHeatmap: false,
    stylePreset: 'B',
    primaryColor: '#0050B4',
    languages: ['English', 'Spanish'],
    disclosure: 'This website is paid for by Meridian Development Partners and produced with Lattice Public Affairs.'
  });
  const [deployed, setDeployed] = useState(false);

  const steps = [
    { n: 1, label: 'Project basics',         icon: FileText },
    { n: 2, label: 'Jurisdiction & docs',    icon: Database },
    { n: 3, label: 'Site & zoning',          icon: MapPin },
    { n: 4, label: 'Process timeline',       icon: Calendar },
    { n: 5, label: 'Stakeholders',           icon: Users },
    { n: 6, label: 'AI configuration',       icon: Sparkles },
    { n: 7, label: 'Branding & disclosure',  icon: Settings },
    { n: 8, label: 'Launch',                 icon: Rocket }
  ];

  return (
    <div style={{ background: CONSOLE.bg, color: CONSOLE.text, fontFamily: '"Public Sans", system-ui, sans-serif', minHeight: '100vh' }}>
      <BuilderSubHeader data={data} step={step} totalSteps={steps.length} deployed={deployed} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-12 gap-4 lg:gap-6">
        <aside className="hidden lg:block lg:col-span-3">
          <BuilderSidebar steps={steps} currentStep={step} onStep={setStep} />
        </aside>
        <div className="col-span-12 lg:hidden">
          <BuilderMobileStep steps={steps} currentStep={step} onStep={setStep} />
        </div>
        <main className="col-span-12 lg:col-span-9">
          <div className="rounded-lg p-5 sm:p-8" style={{ background: CONSOLE.surface, border: `1px solid ${CONSOLE.border}` }}>
            {step === 1 && <StepBasics data={data} setData={setData} />}
            {step === 2 && <StepJurisdiction data={data} setData={setData} />}
            {step === 3 && <StepSite data={data} setData={setData} />}
            {step === 4 && <StepProcess data={data} setData={setData} />}
            {step === 5 && <StepStakeholders data={data} setData={setData} />}
            {step === 6 && <StepAI data={data} setData={setData} />}
            {step === 7 && <StepBranding data={data} setData={setData} />}
            {step === 8 && <StepLaunch data={data} deployed={deployed} setDeployed={setDeployed} />}
            <BuilderNav step={step} totalSteps={steps.length} setStep={setStep} canDeploy={step === 8 && !deployed} />
          </div>
        </main>
      </div>
    </div>
  );
}

function BuilderSubHeader({ data, step, totalSteps, deployed }) {
  return (
    <div className="border-b" style={{ borderColor: CONSOLE.border, background: CONSOLE.surface }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: CONSOLE.bg, border: `1px solid ${CONSOLE.accent}` }}>
            <Terminal className="w-4 h-4" style={{ color: CONSOLE.accent }} />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider flex items-center gap-2" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>
              <span>builder</span>
              <span style={{ color: CONSOLE.textDim }}>·</span>
              <span style={{ color: CONSOLE.accent }}>new project</span>
            </div>
            <div className="font-semibold text-lg truncate" style={{ color: CONSOLE.text }}>{data.name || 'Untitled project'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-xs px-2 py-1 rounded" style={{ background: deployed ? 'rgba(92,255,184,0.1)' : 'rgba(124,168,255,0.1)', color: deployed ? CONSOLE.accent : CONSOLE.primary, fontFamily: '"IBM Plex Mono", monospace' }}>
            {deployed ? '● deployed' : '○ draft'}
          </div>
          <div className="text-sm" style={{ color: CONSOLE.textMuted }}>
            Step <span style={{ color: CONSOLE.text }}>{step}</span> of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderSidebar({ steps, currentStep, onStep }) {
  return (
    <nav className="rounded-lg p-3" style={{ background: CONSOLE.surface, border: `1px solid ${CONSOLE.border}` }}>
      <div className="text-xs uppercase tracking-wider mb-3 px-2 pt-2" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>Setup</div>
      <ol className="space-y-1">
        {steps.map((s) => {
          const active = s.n === currentStep;
          const done = s.n < currentStep;
          return (
            <li key={s.n}>
              <button onClick={() => onStep(s.n)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors"
                style={{
                  background: active ? CONSOLE.bg : 'transparent',
                  color: active ? CONSOLE.accent : done ? CONSOLE.text : CONSOLE.textMuted,
                  border: active ? `1px solid ${CONSOLE.accent}40` : '1px solid transparent'
                }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: done ? CONSOLE.accent : active ? 'transparent' : CONSOLE.bg, color: done ? CONSOLE.bg : active ? CONSOLE.accent : CONSOLE.textDim, border: `1px solid ${done ? CONSOLE.accent : active ? CONSOLE.accent : CONSOLE.borderStrong}`, fontFamily: '"IBM Plex Mono", monospace' }}>
                  {done ? <Check className="w-3 h-3" /> : s.n}
                </span>
                <span className="text-sm truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BuilderMobileStep({ steps, currentStep, onStep }) {
  const cur = steps[currentStep - 1];
  const Icon = cur.icon;
  return (
    <div className="rounded-lg p-4 flex items-center justify-between" style={{ background: CONSOLE.surface, border: `1px solid ${CONSOLE.border}` }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: CONSOLE.bg, border: `1px solid ${CONSOLE.accent}40` }}>
          <Icon className="w-4 h-4" style={{ color: CONSOLE.accent }} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>
            Step {currentStep} of {steps.length}
          </div>
          <div className="text-sm font-semibold" style={{ color: CONSOLE.text }}>{cur.label}</div>
        </div>
      </div>
    </div>
  );
}

function BuilderNav({ step, totalSteps, setStep, canDeploy }) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: CONSOLE.border }}>
      <button disabled={step === 1} onClick={() => setStep(step - 1)}
        className="px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: CONSOLE.bg, color: CONSOLE.text, border: `1px solid ${CONSOLE.border}`, minHeight: 44 }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      {step < totalSteps && (
        <button onClick={() => setStep(step + 1)}
          className="px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-colors"
          style={{ background: CONSOLE.accent, color: CONSOLE.bg, minHeight: 44 }}>
          Next: {step + 1 < totalSteps ? `Step ${step + 1}` : 'Launch'} <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* --- step header used across all steps -------------------------------- */

function StepHeader({ n, title, help }) {
  return (
    <div className="mb-6">
      <div className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: CONSOLE.accent, fontFamily: '"IBM Plex Mono", monospace' }}>
        <span>step {String(n).padStart(2, '0')}</span>
        <span style={{ color: CONSOLE.textDim }}>/</span>
        <span style={{ color: CONSOLE.textMuted }}>of 08</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: CONSOLE.text }}>{title}</h2>
      {help && <p className="text-base leading-relaxed" style={{ color: CONSOLE.textMuted }}>{help}</p>}
    </div>
  );
}

function CField({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: CONSOLE.text }}>{label}</label>
      {hint && <p className="text-xs mb-2" style={{ color: CONSOLE.textMuted }}>{hint}</p>}
      {children}
    </div>
  );
}

const cInputStyle = {
  background: CONSOLE.bg,
  color: CONSOLE.text,
  border: `1px solid ${CONSOLE.border}`,
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  minHeight: 44
};

function CInput(props) { return <input {...props} style={{ ...cInputStyle, ...(props.style || {}) }} />; }
function CSelect({ children, ...props }) { return <select {...props} style={{ ...cInputStyle, ...(props.style || {}) }}>{children}</select>; }
function CTextarea(props) { return <textarea {...props} style={{ ...cInputStyle, minHeight: 80, resize: 'vertical', ...(props.style || {}) }} />; }

/* --- Step 1: Basics --------------------------------------------------- */

function StepBasics({ data, setData }) {
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });
  return (
    <div>
      <StepHeader n={1} title="Project basics" help="The high-level identifiers we'll use throughout the platform. You can edit any of these later." />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8"><CField label="Project name"><CInput value={data.name} onChange={set('name')} /></CField></div>
        <div className="col-span-12 md:col-span-4">
          <CField label="Application type">
            <CSelect value={data.type} onChange={set('type')}>
              <option>Rezoning</option><option>Special Use Permit</option><option>PUD</option><option>Annexation</option><option>Plat / Subdivision</option>
            </CSelect>
          </CField>
        </div>
        <div className="col-span-12 md:col-span-6"><CField label="Applicant (the developer)"><CInput value={data.applicant} onChange={set('applicant')} /></CField></div>
        <div className="col-span-12 md:col-span-6"><CField label="Government-affairs / lobby firm"><CInput value={data.firm} onChange={set('firm')} /></CField></div>
        <div className="col-span-12 md:col-span-8"><CField label="Parcel address"><CInput value={data.address} onChange={set('address')} /></CField></div>
        <div className="col-span-12 md:col-span-4"><CField label="Site size"><CInput value={data.parcelSize} onChange={set('parcelSize')} /></CField></div>
      </div>
    </div>
  );
}

/* --- Step 2: Jurisdiction + the agentic ingestion terminal ----------- */

function StepJurisdiction({ data, setData }) {
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState([]);

  const sequence = [
    { d: 0,    line: '$ lattice ingest --jurisdiction=cherrywood-co --strategy=hierarchical', type: 'cmd' },
    { d: 350,  line: 'Connecting to ingestion pipeline...', type: 'info' },
    { d: 750,  line: '→ pipeline-v2.3.1 ready (us-west-2)', type: 'detail' },
    { d: 1100, line: 'Loading cherrywood-comp-plan-2021.pdf (4.2MB, 87 pages)', type: 'info' },
    { d: 1700, line: 'Parsing document structure...', type: 'info' },
    { d: 2300, line: '→ detected 8 chapters, 47 subsections, 12 tables, 3 maps', type: 'detail' },
    { d: 2900, line: 'Applying hierarchical chunking (preserve §-§§-table boundaries)', type: 'info' },
    { d: 3700, line: '→ 247 chunks generated, parent-child links preserved', type: 'detail' },
    { d: 4200, line: 'Generating embeddings with voyage-3-large...', type: 'info' },
    { d: 5400, line: '→ 247/247 embeddings (1536-dim)', type: 'detail' },
    { d: 5800, line: 'Writing to pgvector → idx_cherrywood_comp_plan_2021', type: 'info' },
    { d: 6400, line: '→ indexed 247 rows · 1.21 MB · ivfflat lists=50', type: 'detail' },
    { d: 6900, line: 'Loading cherrywood-zoning-code.pdf (2.1MB, 134 pages)', type: 'info' },
    { d: 7600, line: '→ 89 chunks · 89/89 embeddings · indexed → idx_cherrywood_zoning', type: 'detail' },
    { d: 8200, line: 'Cross-validating citations against source...', type: 'info' },
    { d: 8800, line: '→ 336/336 citations resolve (100%)', type: 'detail' },
    { d: 9300, line: 'Running smoke-test queries...', type: 'info' },
    { d: 10000,line: '  Q: "What is the maximum building height in MX-3?"', type: 'detail' },
    { d: 10500,line: '  A: "65 feet" · cite: Zoning Code §17.32.060 · confidence 0.94', type: 'detail' },
    { d: 11100,line: '✓ Jurisdiction corpus ready. 336 chunks live for RAG queries.', type: 'success' }
  ];

  function run() {
    setRunning(true);
    setLines([]);
    sequence.forEach(({ d, line, type }) => {
      setTimeout(() => setLines((prev) => [...prev, { line, type }]), d);
    });
    setTimeout(() => { setData({ ...data, compPlanIngested: true, zoningIngested: true }); setRunning(false); }, sequence[sequence.length - 1].d + 200);
  }

  function colorFor(type) {
    if (type === 'cmd')     return CONSOLE.accent;
    if (type === 'success') return CONSOLE.accent;
    if (type === 'detail')  return CONSOLE.textMuted;
    if (type === 'error')   return CONSOLE.error;
    return CONSOLE.text;
  }

  return (
    <div>
      <StepHeader n={2} title="Jurisdiction & documents" help="Upload the city's governing documents. We'll parse them, preserve their hierarchy, and make every section answerable with citations — this is what powers the RAG search on the public site." />
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 md:col-span-7">
          <CField label="City / county"><CInput value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} /></CField>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="text-sm font-semibold mb-1" style={{ color: CONSOLE.text }}>Document corpus</div>
          <div className="rounded-md flex items-center justify-between px-3 py-2" style={{ background: CONSOLE.bg, border: `1px solid ${CONSOLE.border}`, minHeight: 44 }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: CONSOLE.textMuted }}>
              <Database className="w-4 h-4" style={{ color: data.compPlanIngested ? CONSOLE.accent : CONSOLE.textDim }} />
              {data.compPlanIngested ? <span style={{ color: CONSOLE.accent }}>2 documents · 336 chunks indexed</span> : <span>No documents yet</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 mb-5">
        {[
          { name: 'Comprehensive Plan 2021', size: '4.2 MB', status: data.compPlanIngested ? 'indexed' : 'pending' },
          { name: 'Zoning Code (current)',   size: '2.1 MB', status: data.zoningIngested ? 'indexed' : 'pending' },
          { name: 'Design Guidelines',       size: '— optional', status: 'skip' }
        ].map((doc, i) => (
          <div key={i} className="col-span-12 md:col-span-4 rounded-md p-4 flex flex-col" style={{ background: CONSOLE.surfaceAlt, border: `1px solid ${doc.status === 'indexed' ? CONSOLE.accent + '40' : CONSOLE.border}` }}>
            <div className="flex items-start justify-between gap-2">
              <FileText className="w-5 h-5" style={{ color: doc.status === 'indexed' ? CONSOLE.accent : CONSOLE.textMuted }} />
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: doc.status === 'indexed' ? 'rgba(92,255,184,0.1)' : 'rgba(139,149,168,0.1)', color: doc.status === 'indexed' ? CONSOLE.accent : CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>
                {doc.status}
              </span>
            </div>
            <div className="font-semibold mt-3" style={{ color: CONSOLE.text, fontSize: 14 }}>{doc.name}</div>
            <div className="text-xs mt-1" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>{doc.size}</div>
          </div>
        ))}
      </div>

      <button onClick={run} disabled={running}
        className="px-5 py-2.5 rounded font-semibold flex items-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: CONSOLE.accent, color: CONSOLE.bg, minHeight: 44 }}>
        <Zap className="w-4 h-4" /> {running ? 'Ingesting…' : data.compPlanIngested ? 'Re-run ingestion' : 'Start ingestion'}
      </button>

      <div className="rounded-md p-4 max-h-[340px] overflow-y-auto" style={{ background: CONSOLE.bg, border: `1px solid ${CONSOLE.border}`, fontFamily: '"IBM Plex Mono", monospace', fontSize: 13 }}>
        {lines.length === 0 && <div style={{ color: CONSOLE.textDim }}>$ awaiting input — click "Start ingestion" to begin</div>}
        {lines.map((l, i) => (
          <div key={i} style={{ color: colorFor(l.type), lineHeight: 1.7 }}>
            {l.type === 'success' && <span style={{ marginRight: 6 }}>✓</span>}
            {l.line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Step 3: Site & zoning ------------------------------------------ */

function StepSite({ data, setData }) {
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });
  return (
    <div>
      <StepHeader n={3} title="Site & zoning" help="The before-and-after zoning that drives the entire entitlement." />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6"><CField label="Current zoning"><CInput value={data.currentZoning} onChange={set('currentZoning')} /></CField></div>
        <div className="col-span-12 md:col-span-6"><CField label="Proposed zoning"><CInput value={data.proposedZoning} onChange={set('proposedZoning')} /></CField></div>
      </div>
      <div className="rounded-md p-4 mt-5" style={{ background: CONSOLE.surfaceAlt, border: `1px solid ${CONSOLE.border}` }}>
        <div className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: CONSOLE.text }}>
          <MapPin className="w-4 h-4" style={{ color: CONSOLE.accent }} /> Parcel overlay
        </div>
        <div className="grid grid-cols-8 gap-1 max-w-md">
          {Array(40).fill(0).map((_, i) => {
            const isSite = i === 18;
            return <div key={i} className="aspect-square rounded-sm" style={{ background: isSite ? CONSOLE.accent : '#1A2238' }} />;
          })}
        </div>
        <div className="text-xs mt-3" style={{ color: CONSOLE.textMuted }}>Centroid auto-resolved from address · adjust GIS overlay in step 7</div>
      </div>
    </div>
  );
}

/* --- Step 4: Process timeline --------------------------------------- */

function StepProcess({ data, setData }) {
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });
  const dates = [
    { k: 'submittal',   label: 'Formal submittal' },
    { k: 'referralEnd', label: 'Referral period ends' },
    { k: 'hearing',     label: 'Planning Commission hearing' },
    { k: 'council',     label: 'City Council vote' }
  ];
  return (
    <div>
      <StepHeader n={4} title="Process timeline" help="The state-regulated dates that drive every CTA on the public site. Hearing in red as the closing-argument anchor." />
      <div className="grid grid-cols-12 gap-4">
        {dates.map((d) => (
          <div key={d.k} className="col-span-12 md:col-span-6">
            <CField label={d.label}><CInput type="date" value={data[d.k]} onChange={set(d.k)} /></CField>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Step 5: Stakeholders -------------------------------------------- */

function StepStakeholders({ data, setData }) {
  return (
    <div>
      <StepHeader n={5} title="Stakeholders" help="Council/commission roster plus the known organized opposition and allied groups. The opposition heatmap and supporter activation tooling both read from this." />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 md:col-span-3"><CField label="Council size"><CInput type="number" value={data.councilCount} onChange={(e) => setData({ ...data, councilCount: parseInt(e.target.value) || 0 })} /></CField></div>
        <div className="col-span-6 md:col-span-9">
          <CField label="Roster">
            <button className="w-full flex items-center justify-center gap-2 rounded text-sm" style={{ background: CONSOLE.bg, border: `1px dashed ${CONSOLE.borderStrong}`, color: CONSOLE.textMuted, padding: '10px 12px', minHeight: 44 }}>
              <Upload className="w-4 h-4" /> Upload roster CSV  <span style={{ color: CONSOLE.textDim }}>· or add manually</span>
            </button>
          </CField>
        </div>
        <div className="col-span-12 md:col-span-6"><CField label="Known opposition groups" hint="Comma-separated. Used to weight the opposition heatmap."><CTextarea value={data.knownOpposition} onChange={(e) => setData({ ...data, knownOpposition: e.target.value })} /></CField></div>
        <div className="col-span-12 md:col-span-6"><CField label="Allied organizations" hint="Likely supporters. Activation funnel will target these first."><CTextarea value={data.allied} onChange={(e) => setData({ ...data, allied: e.target.value })} /></CField></div>
      </div>
    </div>
  );
}

/* --- Step 6: AI configuration --------------------------------------- */

function StepAI({ data, setData }) {
  const toggles = [
    { k: 'aiRag',     title: 'RAG search ("Ask about this project")', desc: 'Cited answers on the public site. Always-cited, never free-generated. Recommended.', rec: true },
    { k: 'aiCluster', title: 'Sentiment + theme clustering',            desc: 'BERTopic-style clustering of public comments. Drives the internal dashboard scatter/bar. Recommended.', rec: true },
    { k: 'aiDrafts',  title: 'Auto-draft "we heard you" responses',     desc: 'AI drafts a response to each themed concern. Nothing publishes without human approval. Recommended.', rec: true },
    { k: 'aiHeatmap', title: 'Opposition heatmap',                       desc: 'Heuristic geographic prediction. Useful for door-knocking triage. Sell as directional, never predictive certainty. Opt-in.', rec: false }
  ];
  return (
    <div>
      <StepHeader n={6} title="AI configuration" help="Every AI surface is RBAC-gated, audit-logged, and requires human approval before anything reaches the public site." />
      <div className="space-y-3">
        {toggles.map((t) => {
          const on = data[t.k];
          return (
            <label key={t.k} className="flex items-start gap-4 rounded-md p-4 cursor-pointer" style={{ background: CONSOLE.surfaceAlt, border: `1px solid ${on ? CONSOLE.accent + '40' : CONSOLE.border}` }}>
              <div className="mt-1 w-11 h-6 rounded-full flex-shrink-0 relative" style={{ background: on ? CONSOLE.accent : CONSOLE.border }}>
                <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all" style={{ background: on ? CONSOLE.bg : CONSOLE.textMuted, left: on ? 22 : 2 }} />
              </div>
              <input type="checkbox" checked={on} onChange={() => setData({ ...data, [t.k]: !on })} className="hidden" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ color: CONSOLE.text }}>{t.title}</span>
                  {t.rec && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgba(92,255,184,0.1)', color: CONSOLE.accent, fontFamily: '"IBM Plex Mono", monospace' }}>recommended</span>}
                </div>
                <p className="text-sm" style={{ color: CONSOLE.textMuted }}>{t.desc}</p>
              </div>
            </label>
          );
        })}
      </div>
      <div className="rounded-md p-4 mt-5 flex items-start gap-3" style={{ background: 'rgba(124,168,255,0.05)', border: `1px solid ${CONSOLE.primary}30` }}>
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: CONSOLE.primary }} />
        <div className="text-sm" style={{ color: CONSOLE.text }}><strong style={{ color: CONSOLE.primary }}>Audit log is always on.</strong> Every AI generation, every approval, every publish event is logged with user, timestamp, and citation source. Non-disable-able. This is what defends your work to clerks.</div>
      </div>
    </div>
  );
}

/* --- Step 7: Branding & disclosure ---------------------------------- */

function StepBranding({ data, setData }) {
  return (
    <div>
      <StepHeader n={7} title="Branding & disclosure" help="Pick the public-site style preset and confirm the disclosure language. Disclosure is required and cannot be hidden." />
      <CField label="Style preset" hint="Editorial reads as Bloomberg/Brookings. Accessible meets WCAG 2.1 AA out-of-the-box. Default to Accessible when in doubt.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: 'A', title: 'Editorial', sub: 'Fraunces + IBM Plex · cream/navy' },
            { v: 'B', title: 'Accessible', sub: 'Atkinson + Public Sans · WCAG AA' }
          ].map((opt) => {
            const on = data.stylePreset === opt.v;
            return (
              <button key={opt.v} onClick={() => setData({ ...data, stylePreset: opt.v })}
                className="text-left rounded-md p-4" style={{ background: on ? CONSOLE.bg : CONSOLE.surfaceAlt, border: `1px solid ${on ? CONSOLE.accent : CONSOLE.border}`, minHeight: 44 }}>
                <div className="font-semibold flex items-center gap-2 mb-1" style={{ color: on ? CONSOLE.accent : CONSOLE.text }}>
                  {on && <Check className="w-4 h-4" />}{opt.title}
                </div>
                <div className="text-sm" style={{ color: CONSOLE.textMuted }}>{opt.sub}</div>
              </button>
            );
          })}
        </div>
      </CField>
      <div className="mt-5"><CField label="Disclosure text" hint="Shown in the footer of every public page. Cannot be removed."><CTextarea value={data.disclosure} onChange={(e) => setData({ ...data, disclosure: e.target.value })} rows={3} /></CField></div>
      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12 md:col-span-6"><CField label="Languages" hint="Selected: English, Spanish (machine translation enabled)"><CInput value={data.languages.join(', ')} readOnly /></CField></div>
        <div className="col-span-12 md:col-span-6"><CField label="Primary brand color" hint="Used in CTAs across the public site"><div className="flex gap-2"><CInput value={data.primaryColor} onChange={(e) => setData({ ...data, primaryColor: e.target.value })} style={{ flex: 1 }} /><div className="w-11 h-11 rounded flex-shrink-0" style={{ background: data.primaryColor, border: `1px solid ${CONSOLE.border}` }} /></div></CField></div>
      </div>
    </div>
  );
}

/* --- Step 8: Launch ------------------------------------------------- */

function StepLaunch({ data, deployed, setDeployed }) {
  const checks = [
    { ok: !!data.name && !!data.applicant,           label: 'Project basics complete' },
    { ok: data.compPlanIngested,                     label: 'Document corpus ingested (336 chunks)' },
    { ok: !!data.currentZoning && !!data.proposedZoning, label: 'Zoning before/after defined' },
    { ok: !!data.hearing,                            label: 'Hearing date set' },
    { ok: data.councilCount > 0,                     label: `Council roster (${data.councilCount} members)` },
    { ok: data.aiRag || data.aiCluster || data.aiDrafts, label: 'AI features configured' },
    { ok: !!data.disclosure,                         label: 'Disclosure language confirmed' },
    { ok: true,                                      label: 'Audit log enabled (always-on)' }
  ];
  const allOk = checks.every((c) => c.ok);

  return (
    <div>
      <StepHeader n={8} title={deployed ? 'Deployed' : 'Launch'} help={deployed ? 'Project is live. Use the links below to share with the team.' : 'Run preflight checks and deploy to staging.'} />

      <div className="rounded-md mb-5" style={{ background: CONSOLE.surfaceAlt, border: `1px solid ${CONSOLE.border}` }}>
        <div className="px-4 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: CONSOLE.border, color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>Preflight checks</div>
        <ul className="divide-y" style={{ borderColor: CONSOLE.border }}>
          {checks.map((c, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: CONSOLE.border }}>
              {c.ok
                ? <Check className="w-4 h-4 flex-shrink-0" style={{ color: CONSOLE.accent }} />
                : <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: CONSOLE.warning }} />}
              <span className="text-sm" style={{ color: c.ok ? CONSOLE.text : CONSOLE.warning }}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {!deployed ? (
        <button onClick={() => setDeployed(true)} disabled={!allOk}
          className="w-full sm:w-auto px-6 py-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: CONSOLE.accent, color: CONSOLE.bg, minHeight: 48 }}>
          <Rocket className="w-5 h-5" /> Deploy to staging
        </button>
      ) : (
        <div className="rounded-md p-5" style={{ background: 'rgba(92,255,184,0.05)', border: `1px solid ${CONSOLE.accent}40` }}>
          <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: CONSOLE.accent, fontFamily: '"IBM Plex Mono", monospace' }}>
            <Check className="w-4 h-4" /> deployment.success
          </div>
          <div className="grid grid-cols-12 gap-3 text-sm">
            <div className="col-span-12 md:col-span-4">
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>Project ID</div>
              <div style={{ color: CONSOLE.text, fontFamily: '"IBM Plex Mono", monospace' }}>prj_cherry_creek_a7f3</div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>Public URL</div>
              <a className="underline flex items-center gap-1" style={{ color: CONSOLE.accent }}>cherrycreekcommons.org <Globe className="w-3 h-3" /></a>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>Internal dashboard</div>
              <a className="underline flex items-center gap-1" style={{ color: CONSOLE.accent }}>lattice.app/prj_cherry_creek_a7f3 <Lock className="w-3 h-3" /></a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: CONSOLE.border, color: CONSOLE.textMuted, fontFamily: '"IBM Plex Mono", monospace' }}>
            Build time: 1m 47s · Documents indexed: 336 chunks · AI features: {[data.aiRag && 'RAG', data.aiCluster && 'Cluster', data.aiDrafts && 'Drafts', data.aiHeatmap && 'Heatmap'].filter(Boolean).join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}
