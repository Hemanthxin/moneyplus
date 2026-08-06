import offerPersonalLoanArt from "./assets/Screenshot 2026-08-06 173025.png";
import offerBusinessLoanArt from "./assets/Screenshot 2026-08-06 173032.png";
import offerHomeLoanArt from "./assets/Screenshot 2026-08-06 173039.png";
import offerCarLoanArt from "./assets/Screenshot 2026-08-06 173044.png";
import offerHealthInsuranceArt from "./assets/Screenshot 2026-08-06 173049.png";
import offerTermInsuranceArt from "./assets/Screenshot 2026-08-06 173055.png";

export const productOfferArtMap = {
  "Personal Loan": offerPersonalLoanArt,
  "Business Loan": offerBusinessLoanArt,
  "Home Loan": offerHomeLoanArt,
  "Car Loan": offerCarLoanArt,
  "Health Insurance": offerHealthInsuranceArt,
  "Term Insurance": offerTermInsuranceArt,
};

export const productOfferIconMap = {
  "Personal Loan": "user",
  "Business Loan": "briefcase",
  "Home Loan": "home",
  "Car Loan": "car",
  "Health Insurance": "health-plus",
  "Term Insurance": "umbrella",
};

export const productArtMap = {
  "Personal Loan": "user-loan",
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

export const ORBIT_CARD_WIDTH = 226;

export const productOrbitPositions = {
  "Personal Loan": { top: "4%", left: "2.2%", rotate: "-4deg", tabSide: "left" },
  "Business Loan": { top: "2%", left: `calc(50% - ${ORBIT_CARD_WIDTH / 2}px)`, rotate: "0deg", tabSide: "left" },
  "Home Loan": { top: "4%", right: "2.2%", rotate: "4deg", tabSide: "right" },
  "Car Loan": { top: "31.5%", left: "0.6%", rotate: "-0.5deg", tabSide: "left" },
  "Term Insurance": { top: "31.5%", right: "0.6%", rotate: "0.5deg", tabSide: "right" },
  "FD Credit Card": { top: "62.8%", left: "0.8%", rotate: "-0.7deg", tabSide: "left" },
  "Gold Loan": { top: "78%", left: `calc(50% - ${ORBIT_CARD_WIDTH / 2}px)`, rotate: "0deg", tabSide: "left" },
  "FD / RD": { top: "62.8%", right: "0.8%", rotate: "0.7deg", tabSide: "right" },
};

export function findRateFeature(features) {
  if (!features?.length) return null;
  return features.find((feature) => /%|interest|rate/i.test(feature)) || features[0];
}
