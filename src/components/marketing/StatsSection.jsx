import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { revealStagger, revealUp } from "../../animations";

const stats = [
  { value: 50000, prefix: "", suffix: "+", label: "Happy Customers" },
  { value: 1200, prefix: "₹", suffix: " Cr+", label: "Loans Disbursed" },
  { value: 50, prefix: "", suffix: "+", label: "Lending Partners" },
  { value: 8.5, prefix: "", suffix: "%", label: "Starting ROI", decimals: 2 },
];

function StatTile({ stat }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, stat.value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, stat.value]);

  const formatted = stat.decimals ? display.toFixed(stat.decimals) : Math.round(display).toLocaleString("en-IN");

  return (
    <motion.div className="stat-tile" ref={ref} variants={revealUp}>
      <strong>
        {stat.prefix}
        {formatted}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <motion.section
      className="stats-section"
      variants={revealStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatTile stat={stat} key={stat.label} />
        ))}
      </div>
    </motion.section>
  );
}

export default StatsSection;
