import React from "react";
import LegalPageLayout from "../components/legal/LegalPageLayout";

function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="11 August 2026">
      <section>
        <h2>1. What we collect</h2>
        <ul>
          <li>Mobile number, name, and email address provided during OTP login and onboarding.</li>
          <li>Financial details you enter into the Eligibility Check and EMI Calculator (income, obligations, loan amount, tenure).</li>
          <li>Application details you submit when applying for a product (city, employment type, requested amount).</li>
          <li>Basic usage data such as pages visited within the dashboard, used only to improve the product.</li>
        </ul>
      </section>

      <section>
        <h2>2. How we use your information</h2>
        <p>
          We use your information to authenticate your account, calculate eligibility and EMI estimates,
          match you with relevant lending partner offers, and process applications you choose to submit. We
          do not sell your personal data to third parties.
        </p>
      </section>

      <section>
        <h2>3. Sharing with lending partners</h2>
        <p>
          When you or your customer submits an application through MoneyPlus, the details required for that
          specific application are shared with the relevant lending partner so they can process it. We share
          only what is necessary for that application — not your full account history.
        </p>
      </section>

      <section>
        <h2>4. Data security</h2>
        <p>
          Access to the dashboard is protected by mobile OTP verification. Data in transit is encrypted, and
          access to stored records is restricted to systems that need it to operate the platform.
        </p>
      </section>

      <section>
        <h2>5. Data retention and deletion</h2>
        <p>
          We retain your account and application data for as long as your account is active. You can
          permanently delete your account and associated data at any time from Profile → Danger Zone by
          confirming your mobile number — this action is immediate and irreversible.
        </p>
      </section>

      <section>
        <h2>6. Your choices</h2>
        <ul>
          <li>You can review and update your profile details at any time from the Profile page.</li>
          <li>You can request a copy of the data we hold about you via the Grievance Redressal page.</li>
          <li>You can delete your account entirely, removing all associated data from our database.</li>
        </ul>
      </section>

      <section>
        <h2>7. Changes to this policy</h2>
        <p>
          We may revise this Privacy Policy periodically. Material changes will be reflected here with an
          updated date at the top of this page.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export default PrivacyPage;
