import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Illustration } from "../icons";
import { productArtMap, productAccentMap, productOrbitPositions, findRateFeature } from "../../productMeta";

function OrbitHub() {
  return (
    <div className="orbit-hub" aria-hidden="true">
      <span className="orbit-hub-ring orbit-hub-ring-3" />
      <span className="orbit-hub-ring orbit-hub-ring-2" />
      <span className="orbit-hub-core">
        <Illustration kind="moneybag" />
      </span>
    </div>
  );
}

function ServicesOrbit({ products, onSelect }) {
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

      const nextLines = products
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

          return { key: product.title, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
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
  }, [products]);

  return (
    <div className="services-orbit-wrap">
      <div className="services-orbit" ref={containerRef}>
        <svg className="orbit-lines" aria-hidden="true">
          {lines.map((line) => (
            <g key={line.key}>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="orbit-line" />
              <circle cx={line.x1} cy={line.y1} r="3.5" className="orbit-dot" />
              <circle cx={line.x2} cy={line.y2} r="3.5" className="orbit-dot" />
            </g>
          ))}
        </svg>

        <div className="orbit-hub-anchor" ref={hubRef}>
          <OrbitHub />
        </div>

        {products.map((product) => {
          const position = productOrbitPositions[product.title] || {
            top: "50%",
            left: "calc(50% - 125px)",
          };
          const rateFeature = findRateFeature(product.features);

          return (
            <motion.button
              key={product.title}
              ref={(node) => {
                if (node) cardRefs.current[product.title] = node;
              }}
              type="button"
              className={`orbit-card ${productAccentMap[product.title] || "accent-blue"}`}
              style={position}
              onClick={() => onSelect(product)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
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
      </div>

      <div className="services-grid services-grid-fallback">
        {products.map((product) => {
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
