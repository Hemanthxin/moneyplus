import React from "react";
import { motion } from "framer-motion";
import { revealUp, revealViewport } from "../../animations";

function CtaBanner() {
  return (
    <motion.section
      className="cta-banner"
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      <div className="cta-banner-inner">
        <div>
          <h2>Ready to find your perfect loan?</h2>
          <p>Join 50,000+ customers who compared, chose, and saved with MoneyPlus.</p>
        </div>
        <motion.a
          className="primary-button cta-banner-button"
          href="#login-card"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started Now
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </motion.a>
      </div>
    </motion.section>
  );
}

export default CtaBanner;
