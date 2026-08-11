import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { revealUp, revealViewport } from "../../animations";
import { Logo } from "../icons";

const companyLinks = [
  { label: "About Us", href: "#why-us" },
  { label: "Contact", href: "#faq" },
  { label: "Careers", href: "#faq" },
  { label: "Blog", href: "#testimonials" },
];

const productLinks = ["Personal Loan", "Home Loan", "Business Loan", "Insurance", "Gold Loan"];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Grievance Redressal", to: "/grievance" },
];

const socials = [
  { label: "Chat with us", icon: "chat" },
  { label: "Talk to an expert", icon: "headset" },
];

function MarketingFooter({ onProductClick }) {
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
          <Logo />
          <p>Smart Finance. Simplified for You.</p>
          <div className="marketing-footer-socials">
            {socials.map((social) => (
              <a className="marketing-footer-social" href="#faq" key={social.label} aria-label={social.label}>
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
          <div className="marketing-footer-column">
            <strong>Company</strong>
            <ul>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="marketing-footer-column">
            <strong>Products</strong>
            <ul>
              {productLinks.map((title) =>
                onProductClick ? (
                  <li key={title}>
                    <button type="button" className="marketing-footer-link-button" onClick={() => onProductClick(title)}>
                      {title}
                    </button>
                  </li>
                ) : (
                  <li key={title}>
                    <a href="#services">{title}</a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="marketing-footer-column">
            <strong>Legal</strong>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
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
