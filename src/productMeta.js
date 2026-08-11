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

export function findRateFeature(features) {
  if (!features?.length) return null;
  return features.find((feature) => /%|interest|rate/i.test(feature)) || features[0];
}
