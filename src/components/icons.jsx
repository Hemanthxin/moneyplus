import React from "react";

function Logo({ variant = "inline" }) {
  return (
    <div className={`brand-logo ${variant}`}>
      <svg className="brand-mark" viewBox="0 0 62 58" role="img" aria-label="MoneyPlus">
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6d32" />
            <stop offset="100%" stopColor="#ff3b2f" />
          </linearGradient>
        </defs>
        <path
          d="M12 42V13c0-3 3.5-4.6 5.7-2.7l14.8 12.7 14.3-12.8c2.2-2 5.7-.4 5.7 2.6v29"
          fill="none"
          stroke="url(#brandGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M44 17h13v8H44z" fill="#ffb800" rx="2" />
        <path d="M48.5 12.5v17" stroke="#ffb800" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div className="brand-wordmark">
        <div className="brand-title" aria-hidden="true">
          <span className="brand-money">Money</span>
          <span className="brand-plus">Plus</span>
        </div>
        <div className="brand-subtitle">ASSOCIATE</div>
      </div>
    </div>
  );
}

function Illustration({ kind }) {
  switch (kind) {
    case "login-hero":
      return (
        <svg viewBox="0 0 420 300" className="illustration login-hero-illustration">
          <ellipse cx="210" cy="250" rx="170" ry="28" fill="#ffe3d7" />
          <g transform="translate(34 52)">
            <circle cx="250" cy="20" r="12" fill="#f8be42" />
            <path d="M65 166 81 67l42 31 23 74z" fill="#d2b48f" />
            <path d="M81 67c15-12 30-12 42 0" fill="none" stroke="#9d7754" strokeWidth="8" />
            <path d="M84 74c17 9 28 9 36 0" fill="none" stroke="#f1ddc4" strokeWidth="4" />
            <g transform="translate(170 25)">
              <path d="M0 105 65 42h70l55 55v84H0z" fill="#fcfcfe" stroke="#ded9e8" strokeWidth="4" />
              <path d="M52 38h82l71 59h-34L120 53 35 121H0z" fill="#ee6d2d" />
              <rect x="79" y="104" width="34" height="69" rx="4" fill="#9e653d" />
              <rect x="23" y="98" width="34" height="34" rx="3" fill="#d5e9f8" />
              <rect x="132" y="98" width="34" height="34" rx="3" fill="#d5e9f8" />
            </g>
            <g transform="translate(100 145)">
              <path d="M0 25a70 70 0 0 1 140 0v22H0z" fill="none" stroke="url(#gaugeGradient)" strokeWidth="16" strokeLinecap="round" />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff532d" />
                  <stop offset="55%" stopColor="#f7bf3c" />
                  <stop offset="100%" stopColor="#10b45a" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="25" r="16" fill="#454850" />
              <path d="M70 25 116-14" stroke="#2b2b34" strokeWidth="8" strokeLinecap="round" />
              <circle cx="70" cy="25" r="8" fill="#81889b" />
            </g>
            <g transform="translate(8 140)">
              <ellipse cx="42" cy="82" rx="34" ry="10" fill="#f0d6c1" />
              <circle cx="42" cy="60" r="28" fill="#e1ab3a" />
              <circle cx="18" cy="78" r="18" fill="#f2c659" />
              <circle cx="65" cy="86" r="16" fill="#f6d98a" />
              <text x="30" y="67" fontSize="22" fontWeight="700" fill="#a06900">
                {"₹"}
              </text>
            </g>
          </g>
        </svg>
      );
    case "business":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <rect x="10" y="30" width="42" height="28" rx="4" fill="#4386ff" />
          <rect x="24" y="22" width="14" height="8" rx="3" fill="#7dadff" />
          <rect x="58" y="50" width="14" height="20" rx="2" fill="#52c4a0" />
          <rect x="76" y="38" width="14" height="32" rx="2" fill="#7ce0b9" />
          <rect x="94" y="22" width="14" height="48" rx="2" fill="#a2f0cb" />
          <path d="M50 66c14-6 24-18 35-33l7 6 10-20-22 2 6 5c-10 11-22 20-38 26z" fill="#2fb174" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M18 42 60 14l42 28v34H18z" fill="#faf9ff" stroke="#d8d3e6" strokeWidth="2" />
          <path d="M10 43 60 8l50 35H92L60 21 28 43z" fill="#8d73f8" />
          <rect x="52" y="54" width="16" height="22" fill="#ab7c50" />
          <rect x="30" y="50" width="14" height="12" fill="#d5e8ff" />
          <rect x="76" y="50" width="14" height="12" fill="#d5e8ff" />
        </svg>
      );
    case "car":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M22 58h76l-8-18c-2-5-7-8-12-8H48c-5 0-10 3-12 8z" fill="#ff8f35" />
          <rect x="16" y="58" width="88" height="14" rx="7" fill="#ff7a22" />
          <circle cx="34" cy="74" r="10" fill="#2f3543" />
          <circle cx="86" cy="74" r="10" fill="#2f3543" />
          <circle cx="34" cy="74" r="4" fill="#c2c9d8" />
          <circle cx="86" cy="74" r="4" fill="#c2c9d8" />
          <path d="M42 40h34c6 0 10 3 13 9H32c2-5 5-9 10-9z" fill="#bde0ff" />
        </svg>
      );
    case "health":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M34 24c8 0 15 6 15 15v6h-9l-18 18c-7-6-12-14-12-23 0-9 7-16 15-16 4 0 8 2 10 5 2-3 6-5 11-5z" fill="#5e87ff" />
          <path d="M66 28h20c8 0 14 6 14 14v26c0 8-6 14-14 14H58c-8 0-14-6-14-14V42c0-8 6-14 14-14z" fill="#7ca3ff" />
          <path d="M75 37v10h10v10H75v10H65V57H55V47h10V37z" fill="#fff" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M60 18c16 11 30 10 30 10v22c0 20-15 28-30 35-15-7-30-15-30-35V28s14 1 30-10z" fill="#61c77a" />
          <circle cx="36" cy="58" r="12" fill="#a4e2af" />
          <circle cx="60" cy="52" r="14" fill="#86d88f" />
          <circle cx="84" cy="58" r="12" fill="#a4e2af" />
          <path d="M34 58h52" stroke="#4aa95b" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <rect x="18" y="24" width="72" height="44" rx="8" fill="#6d57eb" />
          <rect x="18" y="34" width="72" height="10" fill="#8b79f2" />
          <rect x="30" y="52" width="18" height="6" rx="3" fill="#c9bdff" />
          <rect x="68" y="38" width="34" height="34" rx="8" fill="#efe9ff" />
          <text x="79" y="60" fontSize="16" fontWeight="700" fill="#6d57eb">
            FD
          </text>
        </svg>
      );
    case "gold":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M16 62 36 40l20 22H16z" fill="#ffc22b" />
          <path d="M40 62 60 32l20 30H40z" fill="#f7b100" />
          <path d="M68 62 88 40l20 22H68z" fill="#ffc22b" />
          <ellipse cx="24" cy="72" rx="10" ry="7" fill="#ffd771" />
          <ellipse cx="96" cy="72" rx="10" ry="7" fill="#ffd771" />
        </svg>
      );
    case "piggy":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <ellipse cx="58" cy="50" rx="32" ry="22" fill="#ff9cb0" />
          <circle cx="90" cy="48" r="10" fill="#ff9cb0" />
          <circle cx="88" cy="46" r="2.5" fill="#7f4e58" />
          <circle cx="48" cy="74" r="4" fill="#ca687f" />
          <circle cx="70" cy="74" r="4" fill="#ca687f" />
          <path d="M28 40 20 30l14 3z" fill="#ffb4c2" />
          <path d="M52 40h18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="96" cy="20" r="8" fill="#f8be42" />
        </svg>
      );
    case "moneybag":
    default:
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M44 24h32l-8 12H52z" fill="#d0b18d" />
          <path d="M34 42c0-10 12-18 26-18s26 8 26 18v8c0 18-11 26-26 26S34 68 34 50z" fill="#3e8fff" />
          <path d="M34 52h52" stroke="#72b4ff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="22" cy="62" r="10" fill="#f8be42" />
          <circle cx="34" cy="72" r="8" fill="#ffd46a" />
          <text x="53" y="62" fontSize="22" fontWeight="700" fill="#fff3d2">
            {"₹"}
          </text>
        </svg>
      );
  }
}

function MiniIcon({ kind }) {
  const icons = {
    calculator: <path d="M7 2h10a2 2 0 0 1 2 2v16H5V4a2 2 0 0 1 2-2zm1 5h8M8 11h2m4 0h2M8 15h2m4 0h2" />,
    document: <path d="M8 3h7l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 0v5h5" />,
    gauge: <path d="M5 15a7 7 0 0 1 14 0M12 15l4-6" />,
    headset: <path d="M6 13v3a2 2 0 0 0 2 2h1v-5H6zm12 0v3a2 2 0 0 1-2 2h-1v-5h3zM6 13a6 6 0 0 1 12 0" />,
    percent: <path d="M19 5 5 19M7.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM16.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />,
    calendar: <path d="M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />,
    shield: <path d="M12 3c3 2 6 2 6 2v6c0 5-3 7.5-6 9-3-1.5-6-4-6-9V5s3 0 6-2z" />,
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
        <circle cx="17" cy="9" r="2.6" />
        <path d="M15.5 14.2c2.6.4 4.5 2.5 4.5 5.8" />
      </>
    ),
    clock: <path d="M12 7v5l3.5 2M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />,
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" strokeLinejoin="round" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    chat: <path d="M4 5h16v11H8l-4 4z" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[kind]}
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18H5l2-2v-5a5 5 0 1 1 10 0v5l2 2h-4" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ShieldBadge() {
  return (
    <svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="22" fill="#eff5ff" />
      <path
        d="M22 9c6 4 11 4 11 4v8c0 8-6 12-11 15-5-3-11-7-11-15v-8s5 0 11-4z"
        fill="#4f8bff"
      />
      <path d="m17.5 22 3 3 6-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export { Logo, Illustration, MiniIcon, LockIcon, BellIcon, ShieldBadge };
