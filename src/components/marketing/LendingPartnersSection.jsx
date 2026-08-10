import React from "react";
import { motion } from "framer-motion";
import { revealStagger, revealUp } from "../../animations";

const partners = ["HDFC Bank", "ICICI Bank", "AXIS Bank", "Kotak", "IDFC FIRST Bank", "Bajaj Finserv"];

function LendingPartnersSection() {
  return (
    <motion.section
      className="lending-partners-section"
      variants={revealStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="lending-partners-inner">
        <span className="lending-partners-label">Our Lending Partners</span>
        <div className="lending-partners-list">
          {partners.map((partner) => (
            <motion.span className="lending-partner-name" key={partner} variants={revealUp}>
              {partner}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default LendingPartnersSection;
