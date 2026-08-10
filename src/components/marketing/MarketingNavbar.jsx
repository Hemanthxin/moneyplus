import React, { useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "../icons";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#why-us" },
  { label: "Loan Products", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact Us", href: "#faq" },
];

function MarketingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const navBackground = useTransform(scrollY, [0, 90], ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.94)"]);
  const navBlur = useTransform(scrollY, [0, 90], ["blur(6px)", "blur(18px)"]);
  const navShadow = useTransform(
    scrollY,
    [0, 90],
    ["0 0 0 rgba(20, 10, 5, 0)", "0 12px 30px rgba(20, 10, 5, 0.1)"]
  );
  const navBorder = useTransform(scrollY, [0, 90], ["rgba(255,255,255,0.35)", "rgba(255,148,113,0.18)"]);

  return (
    <motion.header
      className="marketing-navbar"
      style={{ backgroundColor: navBackground, backdropFilter: navBlur, boxShadow: navShadow, borderColor: navBorder }}
    >
      <div className="marketing-navbar-inner">
        <a className="marketing-navbar-brand" href="#top">
          <Logo />
        </a>

        <nav className="marketing-navbar-links" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
              {link.label === "Loan Products" ? (
                <svg className="navbar-link-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="marketing-navbar-actions">
          <a className="primary-button compact marketing-navbar-cta" href="#login-card">
            Apply Now
          </a>
          <button
            className={`marketing-navbar-toggle ${menuOpen ? "open" : ""}`}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="marketing-navbar-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a className="primary-button compact" href="#login-card" onClick={() => setMenuOpen(false)}>
              Login
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

export default MarketingNavbar;
