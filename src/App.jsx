import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getDashboard, getOffers, registerUser, sendOtp, verifyOtp } from "./api/client";
import homeHeroImage from "./assets/home-hero.jpg";

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

const onboardingSteps = [
  { key: "mobile", label: "Mobile" },
  { key: "otp", label: "OTP" },
  { key: "details", label: "Details" },
];

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

function useSession() {
  const [session, setSession] = useState(() => {
    const raw = window.localStorage.getItem("moneyplus-session");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (session) {
      window.localStorage.setItem("moneyplus-session", JSON.stringify(session));
    } else {
      window.localStorage.removeItem("moneyplus-session");
    }
  }, [session]);

  return [session, setSession];
}

function App() {
  const [session, setSession] = useSession();

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onAuthenticated={setSession} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          session ? (
            <DashboardPage session={session} onLogout={() => setSession(null)} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

function LoginPage({ onAuthenticated }) {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [onboarding, setOnboarding] = useState({
    fullName: "",
    email: "",
  });

  const formattedDigits = mobile.replace(/\D/g, "").slice(0, 10);
  const progressIndex = onboardingSteps.findIndex((item) => item.key === step);

  async function handleSendOtp(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await sendOtp(formattedDigits);
      setMessage(response.message);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp(formattedDigits, otp);
      setMessage(response.message);
      if (response.onboarding_required) {
        setStep("details");
        return;
      }

      onAuthenticated(response.session);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateOnboarding(field, value) {
    setOnboarding((current) => ({ ...current, [field]: value }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (!onboarding.fullName.trim()) {
      setError("Please enter your name as per your PAN card");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(onboarding.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        mobile: formattedDigits,
        full_name: onboarding.fullName.trim(),
        email: onboarding.email.trim(),
      });
      onAuthenticated(response.session);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetToMobile() {
    setStep("mobile");
    setOtp("");
    setMessage("");
    setError("");
  }

  function renderStepForm() {
    if (step === "mobile" || step === "otp") {
      return (
        <form className="auth-form" onSubmit={step === "mobile" ? handleSendOtp : handleVerifyOtp}>
          <label className="field-card">
            <div className="field-leading">
              <span className="flag-india" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="country-code">+91</span>
            </div>
            <input
              type={step === "mobile" ? "tel" : "text"}
              inputMode="numeric"
              value={step === "mobile" ? mobile : otp}
              onChange={(event) =>
                step === "mobile"
                  ? setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                  : setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder={step === "mobile" ? "Enter Mobile Number" : "Enter OTP"}
              aria-label={step === "mobile" ? "Mobile number" : "OTP"}
            />
            <span className="digit-count">
              {step === "mobile" ? `${formattedDigits.length} / 10 digits` : `${otp.length} / 6 digits`}
            </span>
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : step === "mobile" ? "Send OTP" : "Verify OTP"}
          </button>

          <p className="auth-helper">
            {step === "mobile"
              ? "Enter your mobile number."
              : `We sent a 6-digit code to +91 ${formattedDigits || "XXXXXXXXXX"}.`}
          </p>

          {step === "otp" ? (
            <button className="text-button" type="button" onClick={resetToMobile}>
              Change mobile number
            </button>
          ) : null}
        </form>
      );
    }

    return (
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="step-progress" aria-label="Onboarding progress">
          {onboardingSteps.map((item, index) => (
            <span
              className={`step-pill ${index <= progressIndex ? "active" : ""} ${index < progressIndex ? "done" : ""}`}
              key={item.key}
            >
              {item.label}
            </span>
          ))}
        </div>

        <label className="text-field">
          <span>Name (as per PAN card)</span>
          <input
            type="text"
            value={onboarding.fullName}
            onChange={(event) => updateOnboarding("fullName", event.target.value)}
            placeholder="Enter your name as per PAN card"
          />
        </label>

        <label className="text-field">
          <span>Email</span>
          <input
            type="email"
            value={onboarding.email}
            onChange={(event) => updateOnboarding("email", event.target.value)}
            placeholder="Enter your email address"
          />
        </label>

        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={() => setStep("otp")}>
            Back
          </button>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating your profile..." : "Complete Registration"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-gradient" />
      <section className="auth-stage">
        <div className="auth-showcase">
          <div className="auth-showcase-content">
            <div className="brand-block auth-brand">
              <Logo variant="stacked" />
              <p className="brand-tagline">Smart Finance, Simplified</p>
            </div>

            <div className="hero-copy">
              <h1>India&apos;s Smart Financial Partner</h1>
              <p>Personal Loan &amp; Home Loan</p>
            </div>

            <div className="hero-pills" aria-hidden="true">
              <span>Personal Loan</span>
              <span>Business Loan</span>
              <span>Home Loan</span>
            </div>

            <div className="hero-visual">
              <img className="hero-image" src={homeHeroImage} alt="Home loan illustration with house, money bag, coins, and credit score meter" />
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <Logo />
            <div>
              <p className="auth-kicker">Associate Login</p>
              <h2>
                {step === "mobile" && "Continue with mobile number"}
                {step === "otp" && "Verify your OTP"}
                {step === "details" && "Complete your basic details"}
              </h2>
            </div>
          </div>

          {renderStepForm()}

          {message ? <p className="info-text">{message}</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <p className="disclaimer">
            By continuing, you agree to the <a href="/">Privacy Policy</a> and <a href="/">Terms of Use</a>.
          </p>
        </div>
      </section>
    </main>
  );
}

function DashboardPage({ session, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [applications, setApplications] = useState([]);
  const [expertRequests, setExpertRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

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
  }, [sidebarOpen]);

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
          <button className="menu-button" type="button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <span />
            <span />
            <span />
          </button>
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
            <section className="promo-banner panel" role="button" tabIndex={0} onClick={() => setActivePanel("offers")} onKeyDown={(event) => event.key === "Enter" && setActivePanel("offers")}>
              <div className="promo-copy">
                <strong>Compare. Choose. Save.</strong>
                <p>Get the best loan offers from top banks &amp; NBFCs</p>
              </div>
              <div className="promo-art">
                <Illustration kind="moneybag" />
              </div>
            </section>

            <section className="services-section">
              <div className="section-heading">
                <h2>Our Services</h2>
              </div>
              <div className="services-grid">
                {data.products.map((product) => (
                  <button className="service-tile" type="button" key={product.rank} onClick={() => openProductPanel(product)}>
                    <span className={`service-icon ${productArtMap[product.title] || "moneybag"}`}>
                      <Illustration kind={productArtMap[product.title] || "moneybag"} />
                    </span>
                    <span>{product.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="credit-cta panel">
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
            </section>

            <section className="why-choose-section">
              <div className="section-heading">
                <h2>Why Choose MoneyPlus?</h2>
              </div>
              <div className="why-choose-grid">
                {whyChooseUs.map((item) => (
                  <div className="why-choose-item" key={item.title}>
                    <span className="why-choose-icon">
                      <MiniIcon kind={item.icon} />
                    </span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="activity-grid">
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
            </section>

            <section className="security-banner panel" role="button" tabIndex={0} onClick={() => setActivePanel("security")} onKeyDown={(event) => event.key === "Enter" && setActivePanel("security")}>
              <div className="security-icon">
                <ShieldBadge />
              </div>
              <div>
                <strong>100% Secure Platform</strong>
                <p>Your data is safe with us. We use bank-level security.</p>
              </div>
              <button className="banner-arrow" type="button" aria-label="View security details">
                {"\u203A"}
              </button>
            </section>
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

      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen}>
        <div className="sidebar-header">
          <Logo />
          <button className="sidebar-close" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
            {"✕"}
          </button>
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
                    <span className="lender-badge">{offer.name.charAt(0)}</span>
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

function Logo({ variant = "inline" }) {
  return (
    <div className={`brand-logo ${variant}`}>
      <svg className="brand-mark" viewBox="0 0 62 58" role="img" aria-label="MoneyPlus">
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6d32" />
            <stop offset="100%" stopColor="#ff3b2f" />
          </linearGradient>
        </defs>
        <path
          d="M12 42V13c0-3 3.5-4.6 5.7-2.7l14.8 12.7 14.3-12.8c2.2-2 5.7-.4 5.7 2.6v29"
          fill="none"
          stroke="url(#brandGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M44 17h13v8H44z" fill="#ffb800" rx="2" />
        <path d="M48.5 12.5v17" stroke="#ffb800" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div className="brand-wordmark">
        <div className="brand-title" aria-hidden="true">
          <span className="brand-money">Money</span>
          <span className="brand-plus">Plus</span>
        </div>
        <div className="brand-subtitle">ASSOCIATE</div>
      </div>
    </div>
  );
}

function Illustration({ kind }) {
  switch (kind) {
    case "login-hero":
      return (
        <svg viewBox="0 0 420 300" className="illustration login-hero-illustration">
          <ellipse cx="210" cy="250" rx="170" ry="28" fill="#ffe3d7" />
          <g transform="translate(34 52)">
            <circle cx="250" cy="20" r="12" fill="#f8be42" />
            <path d="M65 166 81 67l42 31 23 74z" fill="#d2b48f" />
            <path d="M81 67c15-12 30-12 42 0" fill="none" stroke="#9d7754" strokeWidth="8" />
            <path d="M84 74c17 9 28 9 36 0" fill="none" stroke="#f1ddc4" strokeWidth="4" />
            <g transform="translate(170 25)">
              <path d="M0 105 65 42h70l55 55v84H0z" fill="#fcfcfe" stroke="#ded9e8" strokeWidth="4" />
              <path d="M52 38h82l71 59h-34L120 53 35 121H0z" fill="#ee6d2d" />
              <rect x="79" y="104" width="34" height="69" rx="4" fill="#9e653d" />
              <rect x="23" y="98" width="34" height="34" rx="3" fill="#d5e9f8" />
              <rect x="132" y="98" width="34" height="34" rx="3" fill="#d5e9f8" />
            </g>
            <g transform="translate(100 145)">
              <path d="M0 25a70 70 0 0 1 140 0v22H0z" fill="none" stroke="url(#gaugeGradient)" strokeWidth="16" strokeLinecap="round" />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff532d" />
                  <stop offset="55%" stopColor="#f7bf3c" />
                  <stop offset="100%" stopColor="#10b45a" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="25" r="16" fill="#454850" />
              <path d="M70 25 116-14" stroke="#2b2b34" strokeWidth="8" strokeLinecap="round" />
              <circle cx="70" cy="25" r="8" fill="#81889b" />
            </g>
            <g transform="translate(8 140)">
              <ellipse cx="42" cy="82" rx="34" ry="10" fill="#f0d6c1" />
              <circle cx="42" cy="60" r="28" fill="#e1ab3a" />
              <circle cx="18" cy="78" r="18" fill="#f2c659" />
              <circle cx="65" cy="86" r="16" fill="#f6d98a" />
              <text x="30" y="67" fontSize="22" fontWeight="700" fill="#a06900">
                {"\u20B9"}
              </text>
            </g>
          </g>
        </svg>
      );
    case "business":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <rect x="10" y="30" width="42" height="28" rx="4" fill="#4386ff" />
          <rect x="24" y="22" width="14" height="8" rx="3" fill="#7dadff" />
          <rect x="58" y="50" width="14" height="20" rx="2" fill="#52c4a0" />
          <rect x="76" y="38" width="14" height="32" rx="2" fill="#7ce0b9" />
          <rect x="94" y="22" width="14" height="48" rx="2" fill="#a2f0cb" />
          <path d="M50 66c14-6 24-18 35-33l7 6 10-20-22 2 6 5c-10 11-22 20-38 26z" fill="#2fb174" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M18 42 60 14l42 28v34H18z" fill="#faf9ff" stroke="#d8d3e6" strokeWidth="2" />
          <path d="M10 43 60 8l50 35H92L60 21 28 43z" fill="#8d73f8" />
          <rect x="52" y="54" width="16" height="22" fill="#ab7c50" />
          <rect x="30" y="50" width="14" height="12" fill="#d5e8ff" />
          <rect x="76" y="50" width="14" height="12" fill="#d5e8ff" />
        </svg>
      );
    case "car":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M22 58h76l-8-18c-2-5-7-8-12-8H48c-5 0-10 3-12 8z" fill="#ff8f35" />
          <rect x="16" y="58" width="88" height="14" rx="7" fill="#ff7a22" />
          <circle cx="34" cy="74" r="10" fill="#2f3543" />
          <circle cx="86" cy="74" r="10" fill="#2f3543" />
          <circle cx="34" cy="74" r="4" fill="#c2c9d8" />
          <circle cx="86" cy="74" r="4" fill="#c2c9d8" />
          <path d="M42 40h34c6 0 10 3 13 9H32c2-5 5-9 10-9z" fill="#bde0ff" />
        </svg>
      );
    case "health":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M34 24c8 0 15 6 15 15v6h-9l-18 18c-7-6-12-14-12-23 0-9 7-16 15-16 4 0 8 2 10 5 2-3 6-5 11-5z" fill="#5e87ff" />
          <path d="M66 28h20c8 0 14 6 14 14v26c0 8-6 14-14 14H58c-8 0-14-6-14-14V42c0-8 6-14 14-14z" fill="#7ca3ff" />
          <path d="M75 37v10h10v10H75v10H65V57H55V47h10V37z" fill="#fff" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M60 18c16 11 30 10 30 10v22c0 20-15 28-30 35-15-7-30-15-30-35V28s14 1 30-10z" fill="#61c77a" />
          <circle cx="36" cy="58" r="12" fill="#a4e2af" />
          <circle cx="60" cy="52" r="14" fill="#86d88f" />
          <circle cx="84" cy="58" r="12" fill="#a4e2af" />
          <path d="M34 58h52" stroke="#4aa95b" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <rect x="18" y="24" width="72" height="44" rx="8" fill="#6d57eb" />
          <rect x="18" y="34" width="72" height="10" fill="#8b79f2" />
          <rect x="30" y="52" width="18" height="6" rx="3" fill="#c9bdff" />
          <rect x="68" y="38" width="34" height="34" rx="8" fill="#efe9ff" />
          <text x="79" y="60" fontSize="16" fontWeight="700" fill="#6d57eb">
            FD
          </text>
        </svg>
      );
    case "gold":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M16 62 36 40l20 22H16z" fill="#ffc22b" />
          <path d="M40 62 60 32l20 30H40z" fill="#f7b100" />
          <path d="M68 62 88 40l20 22H68z" fill="#ffc22b" />
          <ellipse cx="24" cy="72" rx="10" ry="7" fill="#ffd771" />
          <ellipse cx="96" cy="72" rx="10" ry="7" fill="#ffd771" />
        </svg>
      );
    case "piggy":
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <ellipse cx="58" cy="50" rx="32" ry="22" fill="#ff9cb0" />
          <circle cx="90" cy="48" r="10" fill="#ff9cb0" />
          <circle cx="88" cy="46" r="2.5" fill="#7f4e58" />
          <circle cx="48" cy="74" r="4" fill="#ca687f" />
          <circle cx="70" cy="74" r="4" fill="#ca687f" />
          <path d="M28 40 20 30l14 3z" fill="#ffb4c2" />
          <path d="M52 40h18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="96" cy="20" r="8" fill="#f8be42" />
        </svg>
      );
    case "moneybag":
    default:
      return (
        <svg viewBox="0 0 120 90" className="illustration">
          <path d="M44 24h32l-8 12H52z" fill="#d0b18d" />
          <path d="M34 42c0-10 12-18 26-18s26 8 26 18v8c0 18-11 26-26 26S34 68 34 50z" fill="#3e8fff" />
          <path d="M34 52h52" stroke="#72b4ff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="22" cy="62" r="10" fill="#f8be42" />
          <circle cx="34" cy="72" r="8" fill="#ffd46a" />
          <text x="53" y="62" fontSize="22" fontWeight="700" fill="#fff3d2">
            {"\u20B9"}
          </text>
        </svg>
      );
  }
}

function MiniIcon({ kind }) {
  const icons = {
    calculator: <path d="M7 2h10a2 2 0 0 1 2 2v16H5V4a2 2 0 0 1 2-2zm1 5h8M8 11h2m4 0h2M8 15h2m4 0h2" />,
    document: <path d="M8 3h7l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 0v5h5" />,
    gauge: <path d="M5 15a7 7 0 0 1 14 0M12 15l4-6" />,
    headset: <path d="M6 13v3a2 2 0 0 0 2 2h1v-5H6zm12 0v3a2 2 0 0 1-2 2h-1v-5h3zM6 13a6 6 0 0 1 12 0" />,
    percent: <path d="M19 5 5 19M7.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM16.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />,
    calendar: <path d="M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[kind]}
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18H5l2-2v-5a5 5 0 1 1 10 0v5l2 2h-4" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ShieldBadge() {
  return (
    <svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="22" fill="#eff5ff" />
      <path
        d="M22 9c6 4 11 4 11 4v8c0 8-6 12-11 15-5-3-11-7-11-15v-8s5 0 11-4z"
        fill="#4f8bff"
      />
      <path d="m17.5 22 3 3 6-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default App;
