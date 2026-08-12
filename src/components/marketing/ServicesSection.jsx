import React from "react";
import { motion } from "framer-motion";
import { revealStagger, revealUp, revealViewport } from "../../animations";
import personalLoanImg from "../../assets/product-personal-loan.png";
import businessLoanImg from "../../assets/product-business-loan.png";
import homeLoanImg from "../../assets/product-home-loan.png";
import carLoanImg from "../../assets/product-car-loan.png";
import healthInsuranceImg from "../../assets/product-health-insurance.png";
import termInsuranceImg from "../../assets/product-term-insurance.png";
import fdCreditCardImg from "../../assets/product-fd-credit-card.png";
import goldLoanImg from "../../assets/product-gold-loan.png";

const productImageMap = {
  "Personal Loan": personalLoanImg,
  "Business Loan": businessLoanImg,
  "Home Loan": homeLoanImg,
  "Car Loan": carLoanImg,
  "Health Insurance": healthInsuranceImg,
  "Term Insurance": termInsuranceImg,
  "FD Credit Card": fdCreditCardImg,
  "Gold Loan": goldLoanImg,
};

const staticServices = [
  { title: "Personal Loan", description: "Quick funds for your personal needs" },
  { title: "Business Loan", description: "Grow your business with ease" },
  { title: "Home Loan", description: "Fulfill your dream of owning a home" },
  { title: "Car Loan", description: "Drive your dream car today" },
  { title: "Health Insurance", description: "Secure your health, secure your future" },
  { title: "Term Insurance", description: "Life cover for your family's security" },
  { title: "FD Credit Card", description: "Build credit with FD backed card" },
  { title: "Gold Loan", description: "Get instant loan against your gold" },
];

function ServicesSection({ products, onSelect }) {
  const services =
    products && products.length
      ? products.map((product) => ({
          title: product.title,
          description: product.subtitle,
        }))
      : staticServices;

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
        {services.map((service) => {
          const MotionTag = onSelect ? motion.button : motion.a;
          const cardProps = onSelect
            ? { type: "button", onClick: () => onSelect(products.find((product) => product.title === service.title)) }
            : { href: "#login-card" };
          return (
            <MotionTag
              className="marketing-service-card"
              key={service.title}
              variants={revealUp}
              whileHover={{ y: -6 }}
              style={{ backgroundImage: `url(${productImageMap[service.title] || personalLoanImg})` }}
              {...cardProps}
            >
              <strong>{service.title}</strong>
              <p>{service.description}</p>
              <span className="marketing-service-link">
                Explore Offers <span aria-hidden="true">→</span>
              </span>
            </MotionTag>
          );
        })}
      </motion.div>
    </section>
  );
}

export default ServicesSection;
