import React from "react";
import { Illustration } from "../icons";
import { productArtMap, productAccentMap, productOfferArtMap, productOrbitOrder, findRateFeature } from "../../productMeta";

const STACK_TOP_BASE = 96;
const STACK_TOP_STEP = 20;

function ServicesStack({ products, onSelect }) {
  const orderedProducts = productOrbitOrder
    .map((title) => products.find((product) => product.title === title))
    .filter(Boolean);
  const displayedProducts = orderedProducts.length ? orderedProducts : products;

  return (
    <div className="services-stack">
      {displayedProducts.map((product, index) => {
        const art = productOfferArtMap[product.title];
        const rateFeature = findRateFeature(product.features);
        const accentClass = productAccentMap[product.title] || "accent-blue";

        return (
          <div
            className="stack-card-sticky"
            key={product.title}
            style={{ top: `${STACK_TOP_BASE + index * STACK_TOP_STEP}px`, zIndex: index + 1 }}
          >
            <button type="button" className={`stack-card ${accentClass}`} onClick={() => onSelect(product)}>
              <div className="stack-card-text">
                <span className="stack-card-icon">
                  <Illustration kind={productArtMap[product.title] || "moneybag"} />
                </span>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                {rateFeature ? <span className="stack-card-pill">{rateFeature}</span> : null}
                <span className="stack-card-cta">
                  Explore Offers
                  <span aria-hidden="true">→</span>
                </span>
              </div>
              <div
                className={`stack-card-art ${art ? "" : "stack-card-art-fallback"}`}
                style={art ? { backgroundImage: `url(${art})` } : undefined}
              >
                {art ? null : <Illustration kind={productArtMap[product.title] || "moneybag"} />}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ServicesStack;
