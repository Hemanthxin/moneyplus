import React from "react";
import { motion } from "framer-motion";
import { revealViewport } from "../../animations";
import { MiniIcon } from "../icons";

const steps = [
  { title: "Check Eligibility", icon: "gauge", description: "Answer a few quick questions — no paperwork, no impact on your credit score." },
  { title: "Compare Offers", icon: "document", description: "See real-time rates from 50+ lenders side-by-side, ranked by fit." },
  { title: "Apply Online", icon: "bolt", description: "Submit your application digitally in under 5 minutes." },
  { title: "Get Funded", icon: "shield", description: "Funds are disbursed directly to your account once approved." },
];

const stepVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function HowItWorksSection() {
  return (
    <section className="marketing-section how-it-works-section" id="how-it-works">
      <div className="marketing-section-heading">
        <span className="marketing-eyebrow">Simple Process</span>
        <h2>How It Works</h2>
        <p>From eligibility check to funded loan — four simple steps.</p>
      </div>

      <div className="how-it-works-track">
        <motion.span
          className="how-it-works-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
        {steps.map((step, index) => (
          <motion.div
            className="how-it-works-step"
            key={step.title}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={stepVariant}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
          >
            <span className="how-it-works-number">
              <MiniIcon kind={step.icon} />
            </span>
            <strong>
              {index + 1}. {step.title}
            </strong>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;
