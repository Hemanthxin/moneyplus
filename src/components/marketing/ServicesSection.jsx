import React from "react";
import { motion } from "framer-motion";
import { revealStagger, revealUp, revealViewport } from "../../animations";
import { Illustration } from "../icons";

const services = [
  { title: "Personal Loan", art: "moneybag", description: "Instant funds for any need, rates starting 10.5% p.a." },
  { title: "Business Loan", art: "business", description: "Fuel your growth with collateral-free business funding." },
  { title: "Home Loan", art: "home", description: "Own your dream home with rates starting 8.5% p.a." },
  { title: "Car Loan", art: "car", description: "Drive home your new car with up to 100% on-road funding." },
  { title: "Health Insurance", art: "health", description: "Cashless coverage for you and your family, hassle-free." },
  { title: "Term Insurance", art: "shield", description: "Secure your family's future with affordable life cover." },
  { title: "FD Credit Card", art: "card", description: "Build credit history with a card secured by your FD." },
  { title: "Gold Loan", art: "gold", description: "Unlock instant liquidity against your gold, low interest." },
  { title: "FD / RD", art: "piggy", description: "Grow your savings safely with guaranteed returns." },
];

function ServicesSection() {
  return (
    <section className="marketing-section services-marketing-section" id="services">
      <div className="marketing-section-heading">
        <span className="marketing-eyebrow">What We Offer</span>
        <h2>Our Loan &amp; Insurance Products</h2>
        <p>Compare 50+ lenders across every major financial product, all in one place.</p>
      </div>

      <motion.div
        className="marketing-services-grid"
        variants={revealStagger}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        {services.map((service) => (
          <motion.a
            className="marketing-service-card"
            href="#login-card"
            key={service.title}
            variants={revealUp}
            whileHover={{ y: -6 }}
          >
            <span className="marketing-service-icon">
              <Illustration kind={service.art} />
            </span>
            <strong>{service.title}</strong>
            <p>{service.description}</p>
            <span className="marketing-service-link">
              Explore Offers <span aria-hidden="true">→</span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

export default ServicesSection;
