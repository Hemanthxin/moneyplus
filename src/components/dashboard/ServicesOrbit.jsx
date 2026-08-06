import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Illustration } from "../icons";
import { productArtMap, productAccentMap, productOrbitOrder, productOrbitPositions, findRateFeature } from "../../productMeta";

const orbitContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.4, rotate: 0 },
  show: (rotate) => ({
    opacity: 1,
    scale: 1,
    rotate: rotate || "0deg",
    transition: { type: "spring", stiffness: 110, damping: 14 },
  }),
};

function OrbitHub() {
  return (
    <motion.div
      className="orbit-hub"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 90, damping: 12 }}
    >
      <motion.span
        className="orbit-hub-aura orbit-hub-aura-outer"
        animate={{ scale: [1, 1.07, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="orbit-hub-aura orbit-hub-aura-mid"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="orbit-hub-aura orbit-hub-aura-inner" />
      <span className="orbit-hub-platform orbit-hub-platform-3" />
      <span className="orbit-hub-platform orbit-hub-platform-2" />
      <motion.span
        className="orbit-hub-platform orbit-hub-platform-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="orbit-hub-core-shell"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="orbit-hub-core">
          <Illustration kind="wallet" />
        </span>
      </motion.span>
    </motion.div>
  );
}

function ServicesOrbit({ products, onSelect }) {
  const displayedProducts = useMemo(() => {
    const orbitProducts = productOrbitOrder.map((title) => products.find((product) => product.title === title)).filter(Boolean);
    return orbitProducts.length ? orbitProducts : products;
  }, [products]);
  const containerRef = useRef(null);
  const hubRef = useRef(null);
  const cardRefs = useRef({});
  const [lines, setLines] = useState([]);

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      const hub = hubRef.current;
      if (!container || !hub) return;

      const containerBox = container.getBoundingClientRect();
      const hubBox = hub.getBoundingClientRect();
      const hubCenter = {
        x: hubBox.left + hubBox.width / 2 - containerBox.left,
        y: hubBox.top + hubBox.height / 2 - containerBox.top,
      };
      const hubRadius = hubBox.width / 2;

      const nextLines = displayedProducts
        .map((product) => {
          const card = cardRefs.current[product.title];
          if (!card) return null;
          const cardBox = card.getBoundingClientRect();
          const cardCenter = {
            x: cardBox.left + cardBox.width / 2 - containerBox.left,
            y: cardBox.top + cardBox.height / 2 - containerBox.top,
          };

          const dx = cardCenter.x - hubCenter.x;
          const dy = cardCenter.y - hubCenter.y;
          const distance = Math.hypot(dx, dy) || 1;
          const ux = dx / distance;
          const uy = dy / distance;

          // Start at the hub's edge (not its center) and end at the card's
          // near edge, approximated via its half-width/height along the
          // line direction, so the line visually touches both shapes.
          const start = { x: hubCenter.x + ux * hubRadius, y: hubCenter.y + uy * hubRadius };
          const cardHalfW = cardBox.width / 2;
          const cardHalfH = cardBox.height / 2;
          const scale = Math.min(cardHalfW / Math.abs(ux || 0.0001), cardHalfH / Math.abs(uy || 0.0001));
          const end = { x: cardCenter.x - ux * scale, y: cardCenter.y - uy * scale };

          return {
            key: product.title,
            accentClass: productAccentMap[product.title] || "accent-blue",
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
          };
        })
        .filter(Boolean);

      setLines(nextLines);
    }

    measure();
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [displayedProducts]);

  return (
    <div className="services-orbit-wrap">
      <motion.div
        className="services-orbit"
        ref={containerRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={orbitContainerVariants}
      >
        <div className="orbit-stage-glow orbit-stage-glow-left" aria-hidden="true" />
        <div className="orbit-stage-glow orbit-stage-glow-right" aria-hidden="true" />
        <div className="orbit-stage-rings" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <svg className="orbit-lines" aria-hidden="true">
          {lines.map((line, index) => (
            <g key={line.key} className={line.accentClass}>
              <motion.line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                className={`orbit-line ${line.accentClass}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: "easeOut" }}
              />
              <motion.circle
                cx={line.x1}
                cy={line.y1}
                r="3.5"
                className={`orbit-dot ${line.accentClass}`}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: 0.55 + index * 0.08 }}
              />
              <motion.circle
                cx={line.x2}
                cy={line.y2}
                r="3.5"
                className={`orbit-dot ${line.accentClass}`}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.08 }}
              />
            </g>
          ))}
        </svg>

        <div className="orbit-hub-anchor" ref={hubRef}>
          <OrbitHub />
        </div>

        {displayedProducts.map((product) => {
          const position = productOrbitPositions[product.title] || {
            top: "50%",
            left: "calc(50% - 125px)",
          };
          const rateFeature = findRateFeature(product.features);

          return (
            <motion.button
              key={product.title}
              ref={(node) => {
                if (node) {
                  cardRefs.current[product.title] = node;
                } else {
                  delete cardRefs.current[product.title];
                }
              }}
              type="button"
              className={`orbit-card ${productAccentMap[product.title] || "accent-blue"} orbit-card-tab-${position.tabSide || "left"}`}
              style={{ top: position.top, left: position.left, right: position.right }}
              custom={position.rotate}
              variants={cardVariants}
              onClick={() => onSelect(product)}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="orbit-card-accent-glow" aria-hidden="true" />
              <span className="orbit-card-accent-block" aria-hidden="true" />
              <span className="orbit-card-icon">
                <Illustration kind={productArtMap[product.title] || "moneybag"} />
              </span>
              <span className="orbit-card-body">
                <strong>{product.title}</strong>
                {product.subtitle ? <span className="orbit-card-subtitle">{product.subtitle}</span> : null}
                {rateFeature ? <span className="orbit-card-rate">{rateFeature}</span> : null}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="services-grid services-grid-fallback">
        {displayedProducts.map((product) => {
          const rateFeature = findRateFeature(product.features);
          return (
            <motion.button
              className={`service-tile ${productAccentMap[product.title] || "accent-blue"}`}
              type="button"
              key={product.title}
              onClick={() => onSelect(product)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={`service-icon ${productArtMap[product.title] || "moneybag"}`}>
                <Illustration kind={productArtMap[product.title] || "moneybag"} />
              </span>
              <span className="service-tile-body">
                <strong>{product.title}</strong>
                {product.subtitle ? <span className="service-tile-subtitle">{product.subtitle}</span> : null}
                {rateFeature ? <span className="service-tile-rate">{rateFeature}</span> : null}
              </span>
              <span className="service-tile-arrow" aria-hidden="true">
                →
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default ServicesOrbit;
