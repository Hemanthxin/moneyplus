import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../icons";

function LegalPageLayout({ title, updated, children }) {
  return (
    <div className="legal-page">
      <header className="legal-page-header">
        <Link to="/" className="legal-page-brand">
          <Logo />
        </Link>
        <Link to="/" className="legal-page-back">
          ← Back to Home
        </Link>
      </header>
      <main className="legal-page-body">
        <h1>{title}</h1>
        <p className="legal-page-updated">Last updated: {updated}</p>
        {children}
      </main>
    </div>
  );
}

export default LegalPageLayout;
