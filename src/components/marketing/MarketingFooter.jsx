import React from "react";
import { motion } from "framer-motion";
import { revealUp, revealViewport } from "../../animations";
import { Logo } from "../icons";

const linkColumns = [
  {
    heading: "Company",
    links: ["About Us", "Contact", "Careers", "Blog"],
  },
  {
    heading: "Products",
    links: ["Personal Loan", "Home Loan", "Business Loan", "Insurance", "Gold Loan"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Grievance Redressal"],
  },
];

const socials = [
  { label: "Chat with us", icon: "chat" },
  { label: "Talk to an expert", icon: "headset" },
];

function MarketingFooter() {
  return (
    <motion.footer
      className="marketing-footer"
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      <div className="marketing-footer-top">
        <div className="marketing-footer-brand">
          <Logo variant="stacked" />
          <p>Smart Finance. Simplified for You.</p>
          <div className="marketing-footer-socials">
            {socials.map((social) => (
              <a className="marketing-footer-social" href="#login-card" key={social.label} aria-label={social.label}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {social.icon === "chat" ? <path d="M4 5h16v11H8l-4 4z" /> : (
                    <path d="M6 13v3a2 2 0 0 0 2 2h1v-5H6zm12 0v3a2 2 0 0 1-2 2h-1v-5h3zM6 13a6 6 0 0 1 12 0" />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="marketing-footer-columns">
          {linkColumns.map((column) => (
            <div className="marketing-footer-column" key={column.heading}>
              <strong>{column.heading}</strong>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#login-card">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="marketing-footer-bottom">
        <span>© 2026 MoneyPlus. All rights reserved.</span>
        <span>MoneyPlus is a loan comparison platform, not a lender.</span>
      </div>
    </motion.footer>
  );
}

export default MarketingFooter;
