import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { revealStagger, revealUp, revealViewport } from "../../animations";
import { MiniIcon } from "../icons";

const faqs = [
  {
    question: "Is MoneyPlus free to use?",
    answer: "Yes. Comparing offers, checking eligibility, and using our calculators is completely free — we never charge you to browse or apply.",
  },
  {
    question: "How is my data protected?",
    answer: "Every application is protected with bank-grade encryption in transit and at rest, and access to your dashboard requires mobile OTP verification.",
  },
  {
    question: "Which lenders are on the platform?",
    answer: "We work with 50+ leading banks and NBFCs across personal, business, home, and car loans, plus insurance and savings products.",
  },
  {
    question: "How long does approval take?",
    answer: "Many partners offer decisions within 24 hours once your documents are submitted, though exact timelines depend on the lender and product.",
  },
  {
    question: "Do I need to visit a branch?",
    answer: "No. The entire journey — from checking eligibility to submitting your application — can be completed online from your phone or laptop.",
  },
  {
    question: "What documents do I need?",
    answer: "Typically KYC (PAN/Aadhaar), income proof, and bank statements. Exact requirements vary by product and lender, and we'll guide you through it.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <motion.div className={`faq-item ${isOpen ? "open" : ""}`} variants={revealUp}>
      <button className="faq-question" type="button" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.question}</span>
        <span className="faq-chevron" aria-hidden="true">
          <MiniIcon kind="chevron" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p>{item.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="marketing-section faq-section" id="faq">
      <div className="marketing-section-heading">
        <span className="marketing-eyebrow">Got Questions?</span>
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know before you get started.</p>
      </div>

      <motion.div
        className="faq-list"
        variants={revealStagger}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        {faqs.map((item, index) => (
          <FaqItem
            item={item}
            key={item.question}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
          />
        ))}
      </motion.div>
    </section>
  );
}

export default FaqSection;
