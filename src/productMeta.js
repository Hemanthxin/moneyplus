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

export const productOrbitOrder = [
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Car Loan",
  "Term Insurance",
  "FD Credit Card",
  "Gold Loan",
  "FD / RD",
];

export const ORBIT_CARD_WIDTH = 244;

export const productOrbitPositions = {
  "Personal Loan": { top: "4%", left: "3%", rotate: "-3deg", tabSide: "left" },
  "Business Loan": { top: "0.8%", left: `calc(50% - ${ORBIT_CARD_WIDTH / 2}px)`, rotate: "0deg", tabSide: "left" },
  "Home Loan": { top: "4%", right: "3%", rotate: "3deg", tabSide: "right" },
  "Car Loan": { top: "31.5%", left: "0.5%", rotate: "0deg", tabSide: "left" },
  "Term Insurance": { top: "31.5%", right: "0.5%", rotate: "0deg", tabSide: "right" },
  "FD Credit Card": { top: "61.5%", left: "0.8%", rotate: "0deg", tabSide: "left" },
  "Gold Loan": { top: "76%", left: `calc(50% - ${ORBIT_CARD_WIDTH / 2}px)`, rotate: "0deg", tabSide: "left" },
  "FD / RD": { top: "61.5%", right: "0.8%", rotate: "0deg", tabSide: "right" },
};

export function findRateFeature(features) {
  if (!features?.length) return null;
  return features.find((feature) => /%|interest|rate/i.test(feature)) || features[0];
}
