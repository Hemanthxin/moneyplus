import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getDashboard, getOffers } from "../api/client";
import { revealUp, revealViewport } from "../animations";
import { BellIcon, Illustration, Logo, MiniIcon, ShieldBadge } from "../components/icons";

const navItems = [
  { title: "Home", panel: "home" },
  { title: "Offers", panel: "offers" },
  { title: "Calculators", panel: "calculators" },
  { title: "Applications", panel: "applications" },
  { title: "Profile", panel: "profile" },
];

const whyChooseUs = [
  { title: "Best Interest Rates", icon: "percent" },
  { title: "Quick Approval", icon: "bolt" },
  { title: "Minimal Documents", icon: "document" },
  { title: "Flexible Repayment", icon: "calendar" },
];

const productArtMap = {
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

const notifications = [
  { title: "Profile Complete", description: "Your account details are saved and ready to go.", time: "Today" },
  { title: "New Offer", description: "Business loan partner rates updated for eligible applicants.", time: "1 day ago" },
  { title: "Security", description: "Your profile is protected with device-level and OTP verification.", time: "2 days ago" },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function loadStoredItems(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function DashboardPage({ session, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanelState] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [applications, setApplications] = useState([]);
  const [expertRequests, setExpertRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 981px)").matches
  );
  const isPoppingPanelRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 981px)");
    const handleChange = (event) => setIsDesktop(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Panel switches (home -> compare -> product, etc.) never touch the URL,
    // so without this the whole dashboard is only ever one browser-history
    // entry deep. Pressing the hardware/browser back button then exits the
    // app instead of stepping back a panel. Tag a base entry for "home" and
    // push one per panel change so back() steps through panels first.
    window.history.replaceState({ panel: "home" }, "");

    function handlePopState(event) {
      isPoppingPanelRef.current = true;
      setActivePanelState(event.state?.panel || "home");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function setActivePanel(panel) {
    if (isPoppingPanelRef.current) {
      isPoppingPanelRef.current = false;
    } else {
      window.history.pushState({ panel }, "");
    }
    setActivePanelState(panel);
  }

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, isDesktop]);

  const applicationsKey = `moneyplus-applications-${session.mobile}`;
  const expertsKey = `moneyplus-expert-requests-${session.mobile}`;

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await getDashboard(session.mobile);
        if (!ignore) {
          setData(response);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [session.mobile]);

  useEffect(() => {
    setApplications(loadStoredItems(applicationsKey));
    setExpertRequests(loadStoredItems(expertsKey));
  }, [applicationsKey, expertsKey]);

  useEffect(() => {
    window.localStorage.setItem(applicationsKey, JSON.stringify(applications));
  }, [applications, applicationsKey]);

  useEffect(() => {
    window.localStorage.setItem(expertsKey, JSON.stringify(expertRequests));
  }, [expertRequests, expertsKey]);

  const scoreSegments = useMemo(() => {
    if (!data) return 0;
    return Math.max(12, Math.min(100, Math.round((data.credit_score.score / 900) * 100)));
  }, [data]);

  const scoreInsight = useMemo(() => {
    if (!data) return "";
    return data.credit_score.score >= 750
      ? "You're in a strong position for the best interest rates and quick approvals."
      : "Timely repayments and lower credit utilization can improve your approval odds.";
  }, [data]);

  const activeNavPanel = navItems.some((item) => item.panel === activePanel) ? activePanel : "home";
  const recentApplications = applications.slice(0, 3);

  if (loading) {
    return <div className="loading-screen">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="loading-screen">
        <p>{error}</p>
        <button className="primary-button compact" onClick={onLogout}>
          Back to Login
        </button>
      </div>
    );
  }

  function openProductPanel(product) {
    setSelectedProduct(product);
    setActivePanel("compare");
  }

  function saveApplication(form) {
    const createdAt = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const record = {
      id: window.crypto?.randomUUID?.() || `${Date.now()}`,
      productTitle: selectedProduct?.title || form.productTitle,
      requestedAmount: form.requestedAmount,
      city: form.city,
      employmentType: form.employmentType,
      monthlyIncome: form.monthlyIncome,
      status: "Under Review",
      createdAt,
    };

    setApplications((current) => [record, ...current]);
    setActivePanel("applications");
  }

  function saveExpertRequest(form) {
    const record = {
      id: window.crypto?.randomUUID?.() || `${Date.now()}`,
      topic: form.topic,
      preferredTime: form.preferredTime,
      note: form.note,
      status: "Callback Requested",
    };
    setExpertRequests((current) => [record, ...current]);
  }

  function renderWorkspace() {
    switch (activePanel) {
      case "applications":
        return (
          <WorkspacePanel title="My Applications" subtitle="Track every application and continue any pending loan journey.">
            <ApplicationsPanel applications={applications} onOpenProduct={openProductPanel} />
          </WorkspacePanel>
        );
      case "offers":
        return (
          <WorkspacePanel title="Recommended Offers" subtitle="Latest partner products based on your dashboard profile.">
            <OffersPanel products={data.products} onOpenProduct={openProductPanel} />
          </WorkspacePanel>
        );
      case "profile":
        return (
          <WorkspacePanel title="My Profile" subtitle="View your account and contact details.">
            <ProfilePanel
              user={data.user}
              notifications={notifications}
              onLogout={onLogout}
              onOpenPanel={setActivePanel}
            />
          </WorkspacePanel>
        );
      case "calculators":
        return (
          <WorkspacePanel title="Calculators" subtitle="Plan your loan before you apply.">
            <CalculatorsPanel onTalkToExpert={() => setActivePanel("expert")} />
          </WorkspacePanel>
        );
      case "credit":
        return (
          <WorkspacePanel title="Credit Score Details" subtitle="Review your score range, lending impact, and practical next steps.">
            <CreditPanel creditScore={data.credit_score} scoreSegments={scoreSegments} scoreInsight={scoreInsight} />
          </WorkspacePanel>
        );
      case "expert":
        return (
          <WorkspacePanel title="Talk to an Expert" subtitle="Request a callback from a financial specialist.">
            <ExpertPanel onSave={saveExpertRequest} />
          </WorkspacePanel>
        );
      case "compare":
        return (
          <WorkspacePanel
            title={selectedProduct ? selectedProduct.title : "Compare Offers"}
            subtitle="Compare & choose the best offer for your requirements."
          >
            <OfferComparePanel product={selectedProduct} onApply={() => setActivePanel("product")} />
          </WorkspacePanel>
        );
      case "product":
        return (
          <WorkspacePanel
            title={selectedProduct ? `${selectedProduct.title} Application` : "Apply Now"}
            subtitle="Submit a quick expression of interest and move your case into review."
          >
            <ProductApplicationPanel product={selectedProduct} onSubmit={saveApplication} />
          </WorkspacePanel>
        );
      case "security":
        return (
          <WorkspacePanel title="Platform Security" subtitle="Understand how the platform protects your financial data.">
            <SecurityPanel />
          </WorkspacePanel>
        );
      case "notifications":
        return (
          <WorkspacePanel title="Notifications" subtitle="Recent updates from your applications and partner marketplace.">
            <NotificationsPanel notifications={notifications} />
          </WorkspacePanel>
        );
      default:
        return null;
    }
  }

  return (
    <main className="dashboard-shell">
      <div className="dashboard-frame">
        <header className="topbar">
          {isDesktop ? null : (
            <button className="menu-button" type="button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          )}
          <Logo />
          <div className="topbar-actions">
            <button className="bell-button" type="button" aria-label="Notifications" onClick={() => setActivePanel("notifications")}>
              <BellIcon />
              <strong>3</strong>
            </button>
          </div>
        </header>

        <section className="welcome-block">
          <h1>
            Hello, {data.user.first_name}! <span>{"\u{1F44B}"}</span>
          </h1>
          <p>Find the best financial solutions for you</p>
        </section>

        {activePanel === "home" ? (
          <>
            <motion.section
              className="promo-banner panel"
              role="button"
              tabIndex={0}
              onClick={() => setActivePanel("offers")}
              onKeyDown={(event) => event.key === "Enter" && setActivePanel("offers")}
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="promo-copy">
                <strong>Compare. Choose. Save.</strong>
                <p>Get the best loan offers from top banks &amp; NBFCs</p>
              </div>
              <div className="promo-art">
                <Illustration kind="moneybag" />
              </div>
            </motion.section>

            <motion.section
              className="services-section"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="section-heading">
                <h2>Our Services</h2>
              </div>
              <div className="services-grid">
                {data.products.map((product) => (
                  <motion.button
                    className="service-tile"
                    type="button"
                    key={product.rank}
                    onClick={() => openProductPanel(product)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className={`service-icon ${productArtMap[product.title] || "moneybag"}`}>
                      <Illustration kind={productArtMap[product.title] || "moneybag"} />
                    </span>
                    <span>{product.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="credit-cta panel"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="credit-cta-icon">
                <MiniIcon kind="gauge" />
              </div>
              <div className="credit-cta-copy">
                <strong>Check Your Credit Score</strong>
                <p>Get your credit score in just 2 minutes</p>
              </div>
              <button className="primary-button compact" type="button" onClick={() => setActivePanel("credit")}>
                Check Now
              </button>
            </motion.section>

            <motion.section
              className="why-choose-section"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="section-heading">
                <h2>Why Choose MoneyPlus?</h2>
              </div>
              <div className="why-choose-grid">
                {whyChooseUs.map((item) => (
                  <motion.div className="why-choose-item" key={item.title} whileHover={{ y: -3 }}>
                    <span className="why-choose-icon">
                      <MiniIcon kind={item.icon} />
                    </span>
                    <span>{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="activity-grid"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <article className="panel recent-card">
                <div className="section-heading">
                  <h2>Recent Activity</h2>
                  <button className="inline-link" type="button" onClick={() => setActivePanel("applications")}>
                    View all
                  </button>
                </div>
                {recentApplications.length ? (
                  <div className="mini-list">
                    {recentApplications.map((application) => (
                      <div className="mini-row" key={application.id}>
                        <div>
                          <strong>{application.productTitle}</strong>
                          <p>{application.city}</p>
                        </div>
                        <span className="status-pill">{application.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-copy">No applications yet. Open any service to begin.</p>
                )}
              </article>

              <article className="panel recent-card">
                <div className="section-heading">
                  <h2>Smart Shortcuts</h2>
                </div>
                <div className="shortcut-grid">
                  <button className="shortcut-card" type="button" onClick={() => setActivePanel("calculators")}>
                    <strong>Calculators</strong>
                    <span>Check eligibility and estimate EMI</span>
                  </button>
                  <button className="shortcut-card" type="button" onClick={() => setActivePanel("expert")}>
                    <strong>Book Expert Call</strong>
                    <span>Ask for personal guidance</span>
                  </button>
                </div>
              </article>
            </motion.section>

            <motion.section
              className="security-banner panel"
              role="button"
              tabIndex={0}
              onClick={() => setActivePanel("security")}
              onKeyDown={(event) => event.key === "Enter" && setActivePanel("security")}
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="security-icon">
                <ShieldBadge />
              </div>
              <div>
                <strong>100% Secure Platform</strong>
                <p>Your data is safe with us. We use bank-level security.</p>
              </div>
              <button className="banner-arrow" type="button" aria-label="View security details">
                {"›"}
              </button>
            </motion.section>
          </>
        ) : (
          <section className="workspace-card panel">{renderWorkspace()}</section>
        )}

      </div>

      <nav className="bottom-tab-bar">
        {navItems.map((item, index) => (
          <button
            className={`bottom-tab-item ${activeNavPanel === item.panel ? "active" : ""}`}
            type="button"
            key={item.title}
            onClick={() => setActivePanel(item.panel)}
          >
            <span className={`nav-glyph glyph-${index + 1}`} />
            {item.title}
          </button>
        ))}
      </nav>

      {isDesktop ? null : (
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen || isDesktop ? "open" : ""}`} aria-hidden={!(sidebarOpen || isDesktop)}>
        <div className="sidebar-header">
          <Logo />
          {isDesktop ? null : (
            <button className="sidebar-close" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
              {"✕"}
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <button
              className={`sidebar-nav-item ${activeNavPanel === item.panel ? "active" : ""}`}
              type="button"
              key={item.title}
              onClick={() => {
                setActivePanel(item.panel);
                setSidebarOpen(false);
              }}
            >
              <span className={`nav-glyph glyph-${index + 1}`} />
              {item.title}
            </button>
          ))}
        </nav>
      </aside>
    </main>
  );
}

function WorkspacePanel({ title, subtitle, children }) {
  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="workspace-body">{children}</div>
    </div>
  );
}

function ApplicationsPanel({ applications, onOpenProduct }) {
  if (!applications.length) {
    return (
      <div className="empty-state">
        <strong>No applications yet</strong>
        <p>Start with any product card on the home dashboard to create your first application.</p>
      </div>
    );
  }

  return (
    <div className="application-list">
      {applications.map((application) => (
        <article className="application-row" key={application.id}>
          <div>
            <strong>{application.productTitle}</strong>
            <p>
              {formatCurrency(Number(application.requestedAmount || 0))} • {application.city}
            </p>
            <span className="meta-line">
              {application.employmentType} • Income {formatCurrency(Number(application.monthlyIncome || 0))}
            </span>
          </div>
          <div className="application-side">
            <span className="status-pill">{application.status}</span>
            <small>{application.createdAt}</small>
            <button className="inline-link" type="button" onClick={() => onOpenProduct({ title: application.productTitle, subtitle: "Continue your application flow", features: [] })}>
              Apply again
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function OffersPanel({ products, onOpenProduct }) {
  return (
    <div className="offer-grid">
      {products.slice(0, 6).map((product) => (
        <button className="offer-card" type="button" key={product.rank} onClick={() => onOpenProduct(product)}>
          <strong>{product.title}</strong>
          <p>{product.subtitle}</p>
          <span>{product.features[0]}</span>
        </button>
      ))}
    </div>
  );
}

function ProfilePanel({ user, notifications, onLogout, onOpenPanel }) {
  const profileRows = [
    ["Full Name", `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`],
    ["Mobile Number", user.mobile],
    ["Email", user.email || "Not available"],
    ["Role", user.role],
  ];

  return (
    <div className="profile-shell">
      <div className="profile-grid">
        {profileRows.map(([label, value]) => (
          <div className="profile-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="more-grid">
        <button className="more-card" type="button" onClick={() => onOpenPanel("notifications")}>
          <strong>Notifications</strong>
          <span>{notifications.length} recent updates</span>
        </button>
        <button className="more-card" type="button" onClick={() => onOpenPanel("security")}>
          <strong>Security Center</strong>
          <span>Review privacy and platform safeguards</span>
        </button>
        <button className="more-card logout" type="button" onClick={onLogout}>
          <strong>Logout</strong>
          <span>Sign out of the dashboard</span>
        </button>
      </div>
    </div>
  );
}

function CalculatorsPanel({ onTalkToExpert }) {
  return (
    <div className="calculators-shell">
      <div className="calculator-block">
        <h3>Eligibility Check</h3>
        <p className="calculator-intro">Estimate how much you may qualify for before applying.</p>
        <EligibilityPanel />
      </div>
      <div className="calculator-block">
        <h3>EMI Calculator</h3>
        <p className="calculator-intro">Plan your monthly outflow before you submit a loan application.</p>
        <EmiPanel />
      </div>
      <div className="calculator-cta">
        <div>
          <strong>Need help deciding?</strong>
          <p>Talk to one of our loan specialists for personalised guidance.</p>
        </div>
        <button className="outline-button" type="button" onClick={onTalkToExpert}>
          Talk to Expert
        </button>
      </div>
    </div>
  );
}

function EligibilityPanel() {
  const [form, setForm] = useState({
    monthlyIncome: "60000",
    monthlyObligations: "12000",
    tenureYears: "15",
    employmentType: "Salaried",
  });

  const eligibleAmount = useMemo(() => {
    const income = Number(form.monthlyIncome || 0);
    const obligations = Number(form.monthlyObligations || 0);
    const tenure = Number(form.tenureYears || 0);
    const multiplier = form.employmentType === "Self Employed" ? 42 : 54;
    return Math.max(0, (income - obligations) * multiplier * Math.max(1, tenure / 10));
  }, [form]);

  return (
    <div className="tool-layout">
      <div className="tool-form">
        <label className="text-field">
          <span>Employment Type</span>
          <select value={form.employmentType} onChange={(event) => setForm((current) => ({ ...current, employmentType: event.target.value }))}>
            <option>Salaried</option>
            <option>Self Employed</option>
          </select>
        </label>
        <label className="text-field">
          <span>Monthly Income</span>
          <input value={form.monthlyIncome} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, monthlyIncome: event.target.value.replace(/\D/g, "") }))} />
        </label>
        <label className="text-field">
          <span>Monthly Obligations</span>
          <input value={form.monthlyObligations} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, monthlyObligations: event.target.value.replace(/\D/g, "") }))} />
        </label>
        <label className="text-field">
          <span>Preferred Tenure (Years)</span>
          <input value={form.tenureYears} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, tenureYears: event.target.value.replace(/\D/g, "") }))} />
        </label>
      </div>
      <div className="result-card">
        <span>Estimated Eligible Amount</span>
        <strong>{formatCurrency(eligibleAmount)}</strong>
        <p>This is a quick estimate for planning. Final approval depends on KYC, bureau, and lender policy.</p>
      </div>
    </div>
  );
}

function EmiPanel() {
  const [form, setForm] = useState({
    principal: "1500000",
    annualRate: "10.5",
    tenureYears: "5",
  });

  const emi = useMemo(() => {
    const principal = Number(form.principal || 0);
    const rate = Number(form.annualRate || 0) / 1200;
    const months = Number(form.tenureYears || 0) * 12;
    if (!principal || !rate || !months) return 0;
    const factor = (1 + rate) ** months;
    return (principal * rate * factor) / (factor - 1);
  }, [form]);

  return (
    <div className="tool-layout">
      <div className="tool-form">
        <label className="text-field">
          <span>Loan Amount</span>
          <input value={form.principal} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, principal: event.target.value.replace(/\D/g, "") }))} />
        </label>
        <label className="text-field">
          <span>Interest Rate (%)</span>
          <input value={form.annualRate} inputMode="decimal" onChange={(event) => setForm((current) => ({ ...current, annualRate: event.target.value.replace(/[^0-9.]/g, "") }))} />
        </label>
        <label className="text-field">
          <span>Tenure (Years)</span>
          <input value={form.tenureYears} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, tenureYears: event.target.value.replace(/\D/g, "") }))} />
        </label>
      </div>
      <div className="result-card">
        <span>Estimated Monthly EMI</span>
        <strong>{formatCurrency(Math.round(emi || 0))}</strong>
        <p>Total repayment planning becomes easier when you compare EMI with your existing monthly obligations.</p>
      </div>
    </div>
  );
}

function CreditPanel({ creditScore, scoreSegments, scoreInsight }) {
  const isStrong = creditScore.score >= 750;
  return (
    <div className="credit-detail">
      <div className="score-layout">
        <div className="score-ring" style={{ "--progress": `${scoreSegments}%` }}>
          <div className="score-ring-inner">
            <strong>{creditScore.score}</strong>
            <span>{creditScore.label}</span>
          </div>
        </div>
        <div className="score-meta">
          <p>Last updated</p>
          <strong>{creditScore.last_updated}</strong>
          <p className="score-insight">{scoreInsight}</p>
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <span>Current Score</span>
          <strong>{creditScore.score}</strong>
          <p>{creditScore.label} profile. Last refreshed on {creditScore.last_updated}.</p>
        </div>
        <div className="insight-card">
          <span>Lender Impact</span>
          <strong>{isStrong ? "Better pricing likely" : "Improve score for stronger approval odds"}</strong>
          <p>{isStrong ? "You may qualify for more competitive interest offers." : "Timely repayments and lower utilization can improve approval quality."}</p>
        </div>
        <div className="insight-card">
          <span>Recommended Next Step</span>
          <strong>{isStrong ? "Proceed with application" : "Check eligibility first"}</strong>
          <p>{isStrong ? "Use the services grid to submit an application." : "Run an eligibility and EMI check before applying."}</p>
        </div>
      </div>
    </div>
  );
}

function ExpertPanel({ onSave }) {
  const [form, setForm] = useState({ topic: "Home Loan", preferredTime: "Today 5 PM - 7 PM", note: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
    setSubmitted(true);
  }

  return (
    <form className="tool-form stacked" onSubmit={handleSubmit}>
      <label className="text-field">
        <span>Topic</span>
        <select value={form.topic} onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}>
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Insurance</option>
        </select>
      </label>
      <label className="text-field">
        <span>Preferred Callback Time</span>
        <select value={form.preferredTime} onChange={(event) => setForm((current) => ({ ...current, preferredTime: event.target.value }))}>
          <option>Today 5 PM - 7 PM</option>
          <option>Tomorrow 10 AM - 1 PM</option>
          <option>Tomorrow 2 PM - 5 PM</option>
        </select>
      </label>
      <label className="text-field">
        <span>Additional Note</span>
        <textarea rows="4" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} placeholder="Tell us what kind of support you need" />
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit">
          Request Callback
        </button>
      </div>
      {submitted ? <p className="info-text">Callback request saved. An expert will reach out based on your preferred slot.</p> : null}
    </form>
  );
}

const AMOUNT_SLIDER_MIN = 25_000;
const AMOUNT_SLIDER_MAX = 10_000_000;

function LenderLogo({ name, logoUrl }) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return <span className="lender-badge">{name.charAt(0)}</span>;
  }

  return (
    <span className="lender-badge lender-badge-logo">
      <img src={logoUrl} alt={`${name} logo`} onError={() => setFailed(true)} loading="lazy" />
    </span>
  );
}

function OfferComparePanel({ product, onApply }) {
  const [amount, setAmount] = useState(500_000);
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [editingRequirements, setEditingRequirements] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const incomeValue = Number(monthlyIncome || 0);

  useEffect(() => {
    if (!product) return undefined;
    let ignore = false;
    setLoading(true);
    setError("");

    getOffers({ product: product.title, amount, monthlyIncome: incomeValue })
      .then((response) => {
        if (!ignore) setResult(response);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, amount, incomeValue]);

  if (!product) {
    return <p className="empty-copy">Select a service from the home dashboard to compare offers.</p>;
  }

  const offers = result?.offers || [];
  const visibleOffers = showAll ? offers : offers.slice(0, 5);

  return (
    <div className="compare-shell">
      <div className="requirements-card">
        <div className="requirements-header">
          <strong>Your Requirements</strong>
          <button className="text-button" type="button" onClick={() => setEditingRequirements((current) => !current)}>
            {editingRequirements ? "Done" : "Edit"}
          </button>
        </div>

        <div className="requirements-grid">
          <div className="requirement-item">
            <span>Loan Amount</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          <div className="requirement-item">
            <span>Monthly Income</span>
            {editingRequirements ? (
              <input
                className="requirement-input"
                inputMode="numeric"
                value={monthlyIncome}
                onChange={(event) => setMonthlyIncome(event.target.value.replace(/\D/g, ""))}
              />
            ) : (
              <strong>{formatCurrency(incomeValue)}</strong>
            )}
          </div>
          <div className="requirement-item">
            <span>Employment</span>
            {editingRequirements ? (
              <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
                <option>Salaried</option>
                <option>Self Employed</option>
              </select>
            ) : (
              <strong>{employmentType}</strong>
            )}
          </div>
        </div>

        <input
          className="amount-slider"
          type="range"
          min={AMOUNT_SLIDER_MIN}
          max={AMOUNT_SLIDER_MAX}
          step={5000}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          aria-label="Loan amount"
        />
        <div className="slider-scale">
          <span>{formatCurrency(AMOUNT_SLIDER_MIN)}</span>
          <span>{formatCurrency(AMOUNT_SLIDER_MAX)}</span>
        </div>
      </div>

      {loading ? <p className="empty-copy">Finding the best offers for you...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && result ? (
        <>
          <div className="offers-list-header">
            <strong>{result.eligible_count} Offers Found</strong>
            <span>Sort by: Interest Rate</span>
          </div>

          {offers.length ? (
            <div className="lender-list">
              {visibleOffers.map((offer) => (
                <article className="lender-card" key={offer.rank}>
                  <div className="lender-card-top">
                    <LenderLogo name={offer.name} logoUrl={offer.logo_url} />
                    <div className="lender-name-block">
                      <strong>{offer.name}</strong>
                      <span className="lender-roi">{offer.roi_label}</span>
                    </div>
                    <div className="lender-salary">
                      <span>Min. Salary</span>
                      <strong>{formatCurrency(offer.min_salary)}</strong>
                    </div>
                  </div>
                  <div className="lender-card-bottom">
                    <span className="lender-amount">
                      {offer.amount_label} &bull; {product.title}
                    </span>
                    <button className="lender-view-button" type="button" onClick={onApply}>
                      View Details
                      <span aria-hidden="true">{"›"}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No matching offers yet</strong>
              <p>Adjust your loan amount or income above, or submit an application and our team will follow up manually.</p>
              <button className="primary-button compact" type="button" onClick={onApply}>
                Submit Application
              </button>
            </div>
          )}

          {!showAll && offers.length > 5 ? (
            <button className="secondary-button" type="button" onClick={() => setShowAll(true)}>
              View All {result.eligible_count} Offers
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function ProductApplicationPanel({ product, onSubmit }) {
  const [form, setForm] = useState({
    requestedAmount: "",
    city: "",
    employmentType: "Salaried",
    monthlyIncome: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, productTitle: product?.title || "Application" });
    setSubmitted(true);
    setForm({
      requestedAmount: "",
      city: "",
      employmentType: "Salaried",
      monthlyIncome: "",
    });
  }

  if (!product) {
    return <p className="empty-copy">Select a product card from the home dashboard to start an application.</p>;
  }

  return (
    <form className="tool-form stacked" onSubmit={handleSubmit}>
      <div className="product-highlight">
        <strong>{product.title}</strong>
        <p>{product.subtitle}</p>
      </div>
      <div className="form-grid">
        <label className="text-field">
          <span>Requested Amount</span>
          <input value={form.requestedAmount} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, requestedAmount: event.target.value.replace(/\D/g, "") }))} placeholder="Enter amount" />
        </label>
        <label className="text-field">
          <span>City</span>
          <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Enter city" />
        </label>
        <label className="text-field">
          <span>Employment Type</span>
          <select value={form.employmentType} onChange={(event) => setForm((current) => ({ ...current, employmentType: event.target.value }))}>
            <option>Salaried</option>
            <option>Self Employed</option>
          </select>
        </label>
        <label className="text-field">
          <span>Monthly Income</span>
          <input value={form.monthlyIncome} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, monthlyIncome: event.target.value.replace(/\D/g, "") }))} placeholder="Enter monthly income" />
        </label>
      </div>
      <div className="form-actions">
        <button className="primary-button" type="submit">
          Submit Application
        </button>
      </div>
      {submitted ? <p className="info-text">Application submitted. Check “My Applications” for status updates.</p> : null}
    </form>
  );
}

function SecurityPanel() {
  return (
    <div className="security-grid">
      <div className="security-card">
        <strong>Encrypted Data</strong>
        <p>Profile and application details are protected with controlled storage and secure transit.</p>
      </div>
      <div className="security-card">
        <strong>OTP Access</strong>
        <p>Every dashboard login requires mobile OTP verification before the user session is restored.</p>
      </div>
      <div className="security-card">
        <strong>Audit Friendly</strong>
        <p>The onboarding flow captures required identity details once and keeps application actions traceable.</p>
      </div>
    </div>
  );
}

function NotificationsPanel({ notifications }) {
  return (
    <div className="application-list">
      {notifications.map((notification) => (
        <article className="application-row" key={notification.title}>
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.description}</p>
          </div>
          <div className="application-side">
            <span className="status-pill">{notification.time}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default DashboardPage;
