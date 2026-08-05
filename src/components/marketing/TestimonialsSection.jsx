import React from "react";
import { motion } from "framer-motion";
import { revealStagger, revealUp, revealViewport } from "../../animations";
import { MiniIcon } from "../icons";

const testimonials = [
  {
    quote:
      "Got my home loan approved in 3 days flat. The comparison tool showed me options I wouldn't have found on my own and saved me lakhs in interest.",
    name: "Rohit S.",
    location: "Pune",
  },
  {
    quote:
      "No branch visits, no endless paperwork. I applied for a business loan from my phone during lunch break and had an offer by evening.",
    name: "Ananya K.",
    location: "Bengaluru",
  },
  {
    quote:
      "The eligibility checker was spot on. It told me exactly what I'd qualify for before I even applied, so there were no surprises.",
    name: "Vikram M.",
    location: "Ahmedabad",
  },
  {
    quote:
      "Customer support actually called back within the hour when I requested an expert consultation. Genuinely helpful, not just a sales pitch.",
    name: "Priya D.",
    location: "Chennai",
  },
];

function TestimonialsSection() {
  return (
    <section className="marketing-section testimonials-section" id="testimonials">
      <div className="marketing-section-heading">
        <span className="marketing-eyebrow">Customer Stories</span>
        <h2>Loved by Thousands of Borrowers</h2>
        <p>Real experiences from customers who found their perfect financial match.</p>
      </div>

      <motion.div
        className="testimonials-grid"
        variants={revealStagger}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        {testimonials.map((testimonial) => (
          <motion.article className="testimonial-card" key={testimonial.name} variants={revealUp} whileHover={{ y: -5 }}>
            <span className="testimonial-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p>{testimonial.quote}</p>
            <div className="testimonial-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <MiniIcon kind="star" key={index} />
              ))}
            </div>
            <div className="testimonial-author">
              <strong>{testimonial.name}</strong>
              <span>{testimonial.location}</span>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default TestimonialsSection;
