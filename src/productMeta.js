export const productArtMap = {
  "Personal Loan": "moneybag",
  "Business Loan": "business",
  "Home Loan": "home",
  "Car Loan": "car",
  "Health Insurance": "health",
  "Term Insurance": "shield",
  "FD Credit Card": "card",
  "Gold Loan": "gold",
  "FD / RD": "piggy",
};

export const productAccentMap = {
  "Personal Loan": "accent-blue",
  "Business Loan": "accent-emerald",
  "Home Loan": "accent-violet",
  "Car Loan": "accent-orange",
  "Health Insurance": "accent-teal",
  "Term Insurance": "accent-green",
  "FD Credit Card": "accent-indigo",
  "Gold Loan": "accent-gold",
  "FD / RD": "accent-pink",
};

// Hand-placed positions (percent of the orbit container) so the layout reads
// as a radial spread around the central hub, mirroring a 3-top / 2-per-side /
// 2-bottom ring rather than a perfect trig circle (which crowds the poles).
// Cards are a fixed 250px wide, so the centered slot uses calc() to center
// exactly - deliberately avoiding `transform` for positioning, since these
// cards are also `motion.button`s with their own whileHover/whileTap scale
// transforms, and framer-motion owns the `transform` style once one is
// present, silently dropping any translate() set via a plain style string.
export const ORBIT_CARD_WIDTH = 250;

export const productOrbitPositions = {
  "Personal Loan": { top: "2%", left: "2%" },
  "Business Loan": { top: "0%", left: `calc(50% - ${ORBIT_CARD_WIDTH / 2}px)` },
  "Home Loan": { top: "2%", right: "2%" },
  "Car Loan": { top: "36%", left: "0%" },
  "Health Insurance": { top: "66%", left: "3%" },
  "Term Insurance": { top: "36%", right: "0%" },
  "FD Credit Card": { top: "66%", right: "3%" },
  "Gold Loan": { top: "78%", left: "18%" },
  "FD / RD": { top: "78%", right: "18%" },
};

export function findRateFeature(features) {
  if (!features?.length) return null;
  return features.find((feature) => /%|interest|rate/i.test(feature)) || features[0];
}
