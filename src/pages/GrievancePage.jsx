import React from "react";
import LegalPageLayout from "../components/legal/LegalPageLayout";

function GrievancePage() {
  return (
    <LegalPageLayout title="Grievance Redressal" updated="11 August 2026">
      <section>
        <h2>Our commitment</h2>
        <p>
          MoneyPlus is committed to resolving Associate and customer concerns quickly and fairly. This page
          explains how to raise a grievance and what to expect once you do.
        </p>
      </section>

      <section>
        <h2>What you can raise a grievance about</h2>
        <ul>
          <li>Incorrect or misleading information shown on the platform (rates, eligibility, offer details).</li>
          <li>Issues with an application submitted through MoneyPlus not being processed by a lending partner.</li>
          <li>Concerns about how your personal data has been collected, used, or shared.</li>
          <li>Any other complaint about your experience using the dashboard.</li>
        </ul>
      </section>

      <section>
        <h2>How to reach us</h2>
        <p>
          The fastest way to reach us is the "Talk to Expert" option available in the Calculators section of
          your dashboard, or the in-app chat and support icons in the footer. For formal written complaints,
          write to <a href="mailto:grievance@moneyplus.example">grievance@moneyplus.example</a>.
        </p>
      </section>

      <section>
        <h2>Resolution timeline</h2>
        <ul>
          <li><strong>Acknowledgement:</strong> within 2 business days of receiving your complaint.</li>
          <li><strong>Resolution:</strong> within 7 business days for most issues; complex cases involving a lending partner may take up to 15 business days.</li>
          <li><strong>Escalation:</strong> if you're not satisfied with the resolution, you can request escalation to the Grievance Redressal Officer.</li>
        </ul>
      </section>

      <section>
        <h2>Grievance Redressal Officer</h2>
        <p>
          If your concern remains unresolved after the standard process, it will be escalated to our
          designated Grievance Redressal Officer for final review, in line with applicable regulatory
          guidelines for digital lending platforms.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export default GrievancePage;
