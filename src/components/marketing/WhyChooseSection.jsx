import React from "react";
import { motion } from "framer-motion";
import { revealStagger, revealUp, revealViewport } from "../../animations";
import { MiniIcon } from "../icons";

const reasons = [
  { title: "Best Interest Rates", icon: "percent", description: "Starting from 8.5% p.a. across 50+ partner lenders." },
  { title: "Quick Approval", icon: "bolt", description: "Get approved in as little as 24 hours, not weeks." },
  { title: "Minimal Documentation", icon: "document", description: "Fully digital KYC — no physical paperwork or branch visits." },
  { title: "Flexible Repayment", icon: "calendar", description: "Choose tenures from 6 months to 20 years to suit your budget." },
  { title: "100% Secure & Confidential", icon: "shield", description: "Bank-grade encryption protects every application you submit." },
  { title: "50+ Lending Partners", icon: "people", description: "Compare offers from top banks and NBFCs side-by-side." },
];

function WhyChooseSection() {
  return (
    <section className="marketing-section why-choose-marketing-section" id="why-us">
      <div className="marketing-section-heading">
        <span className="marketing-eyebrow">Why MoneyPlus</span>
        <h2>Why Choose Us?</h2>
        <p>Thousands trust MoneyPlus to find the right financial product, faster and simpler.</p>
      </div>

      <motion.div
        className="marketing-why-grid"
        variants={revealStagger}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        {reasons.map((reason) => (
          <motion.div className="marketing-why-card" key={reason.title} variants={revealUp} whileHover={{ y: -5 }}>
            <span className="marketing-why-icon">
              <MiniIcon kind={reason.icon} />
            </span>
            <strong>{reason.title}</strong>
            <p>{reason.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default WhyChooseSection;
