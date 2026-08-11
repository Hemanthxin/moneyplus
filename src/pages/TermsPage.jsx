import React from "react";
import LegalPageLayout from "../components/legal/LegalPageLayout";

function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="11 August 2026">
      <section>
        <h2>1. About MoneyPlus</h2>
        <p>
          MoneyPlus ("we", "us", "our") operates a loan and insurance comparison platform that helps
          registered Associates connect their customers with offers from partner banks and NBFCs. MoneyPlus
          is a comparison and referral platform only — we are not a lender, and we do not sanction, disburse,
          or service any loan ourselves.
        </p>
      </section>

      <section>
        <h2>2. Associate accounts</h2>
        <p>
          Access to the MoneyPlus dashboard is limited to verified Associates. You must provide accurate
          mobile number, name, and email details during onboarding, and keep your OTP and account access
          confidential. You are responsible for all activity that happens under your account.
        </p>
      </section>

      <section>
        <h2>3. Use of the platform</h2>
        <ul>
          <li>You will use the eligibility checker, EMI calculator, and offer comparisons for their intended purpose only.</li>
          <li>You will not misrepresent loan terms, interest rates, or approval likelihood to any customer.</li>
          <li>You will not attempt to scrape, reverse-engineer, or resell data shown on the platform.</li>
          <li>You will not submit applications using false or misleading customer information.</li>
        </ul>
      </section>

      <section>
        <h2>4. Offers and eligibility estimates</h2>
        <p>
          Interest rates, eligible amounts, and EMI figures shown on MoneyPlus (including the Eligibility
          Check and EMI Calculator tools) are indicative estimates for planning purposes only. Final approval,
          sanctioned amount, and interest rate are determined solely by the lending partner after their own
          KYC, credit bureau, and underwriting checks.
        </p>
      </section>

      <section>
        <h2>5. Account deletion</h2>
        <p>
          You may permanently delete your Associate account at any time from Profile → Danger Zone. Deletion
          removes your account and associated records from our systems and cannot be undone.
        </p>
      </section>

      <section>
        <h2>6. Limitation of liability</h2>
        <p>
          MoneyPlus is not liable for any loss arising from a lending partner's decision to reject, delay, or
          modify the terms of an application, or from inaccuracies in information provided by a lending
          partner. The platform is provided "as is" without warranties of any kind.
        </p>
      </section>

      <section>
        <h2>7. Changes to these terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use of the platform after a
          change is posted constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Questions about these terms can be raised through the "Talk to Expert" option in your dashboard, or
          via the Grievance Redressal page.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export default TermsPage;
