import React from "react";

const partners = ["HDFC Bank", "ICICI Bank", "AXIS Bank", "Kotak", "IDFC FIRST Bank", "Bajaj Finserv"];

function LendingPartnersSection() {
  return (
    <section className="lending-partners-section">
      <div className="lending-partners-inner">
        <span className="lending-partners-label">Our Lenders</span>
        <div className="lending-partners-track">
          <div className="lending-partners-marquee">
            {[...partners, ...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <span className="lending-partner-name" key={`${partner}-${index}`}>
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LendingPartnersSection;
