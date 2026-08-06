import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { deleteAccount, getDashboard, getOffers } from "../api/client";
import { revealStagger, revealUp, revealViewport } from "../animations";
import { BellIcon, Illustration, Logo, LogoutIcon, MiniIcon, ProfileAvatar, ShieldBadge } from "../components/icons";
import WhyChooseSection from "../components/marketing/WhyChooseSection";
import HowItWorksSection from "../components/marketing/HowItWorksSection";
import TestimonialsSection from "../components/marketing/TestimonialsSection";
import FaqSection from "../components/marketing/FaqSection";
import MarketingFooter from "../components/marketing/MarketingFooter";
import dashboardHeroImage from "../assets/dashboard-hero.jpg";
import promoBannerBg from "../assets/ChatGPT Image Aug 6, 2026, 05_13_43 PM.png";
import ServicesOrbit from "../components/dashboard/ServicesOrbit";
import { productOfferArtMap, productOfferIconMap } from "../productMeta";

const navItems = [
  { title: "Home", id: "home-top" },
  { title: "Offers", id: "offers-section" },
  { title: "Calculators", id: "calculators-section" },
  { title: "Applications", id: "applications-section" },
];

const sectionIds = navItems.map((item) => item.id);

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home-top");
  const isPoppingPanelRef = useRef(false);
  const pendingSectionRef = useRef(null);

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
    if (!menuOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (activePanel !== "home") return undefined;

    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const SCROLLSPY_OFFSET = 110;

    function handleScroll() {
      let current = elements[0].id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top - SCROLLSPY_OFFSET <= 0) {
          current = element.id;
        }
      }
      // A programmatic scrollToSection() call already set the intended
      // target optimistically. Ignore readings until the page actually
      // settles on that target — otherwise a transient layout-shift scroll
      // event fired while the outgoing panel unmounts (which briefly reads
      // as "home-top") clobbers the deliberate destination before the real
      // smooth-scroll animation even starts.
      if (pendingSectionRef.current && pendingSectionRef.current !== current) {
        return;
      }
      pendingSectionRef.current = null;
      setActiveSection(current);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activePanel, data]);

  function scrollToSection(id) {
    setMenuOpen(false);
    setActiveSection(id);
    pendingSectionRef.current = id;
    if (activePanel !== "home") {
      setActivePanel("home");
      // AnimatePresence (mode="wait") keeps the outgoing detail panel mounted
      // until its exit transition finishes, so the home sections aren't in
      // the DOM yet on the next tick. Poll briefly until the target appears.
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 20) {
          attempts += 1;
          setTimeout(tryScroll, 30);
        }
      };
      setTimeout(tryScroll, 30);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
    scrollToSection("applications-section");
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

  async function handleDeleteAccount() {
    await deleteAccount(session.mobile);
    window.localStorage.removeItem(applicationsKey);
    window.localStorage.removeItem(expertsKey);
    onLogout();
  }

  function renderWorkspace() {
    switch (activePanel) {
      case "profile":
        return (
          <WorkspacePanel title="My Profile" subtitle="View your account and contact details.">
            <ProfilePanel
              user={data.user}
              notifications={notifications}
              onLogout={onLogout}
              onOpenPanel={setActivePanel}
              onDeleteAccount={handleDeleteAccount}
            />
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
      <motion.header className="dashboard-navbar" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="dashboard-navbar-inner">
          <div className="dashboard-navbar-brand">
            <Logo />
          </div>

          <nav className="dashboard-navbar-links" aria-label="Primary">
            {navItems.map((item) => (
              <button
                className={activePanel === "home" && activeSection === item.id ? "active" : ""}
                type="button"
                key={item.title}
                onClick={() => scrollToSection(item.id)}
              >
                {item.title}
                {activePanel === "home" && activeSection === item.id ? (
                  <motion.span
                    className="dashboard-nav-underline"
                    layoutId="dashboardNavUnderline"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                ) : null}
              </button>
            ))}
          </nav>

          <div className="dashboard-navbar-actions">
            <motion.button
              className="bell-button"
              type="button"
              aria-label="Notifications"
              onClick={() => setActivePanel("notifications")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <BellIcon />
              <strong>3</strong>
            </motion.button>
            <motion.button
              className="profile-avatar-button"
              type="button"
              aria-label="Open profile"
              onClick={() => setActivePanel("profile")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <ProfileAvatar />
            </motion.button>
            <motion.button
              className="logout-nav-button"
              type="button"
              onClick={onLogout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogoutIcon />
              <span>Logout</span>
            </motion.button>
            <button
              className={`dashboard-navbar-toggle ${menuOpen ? "open" : ""}`}
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              className="dashboard-navbar-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              aria-label="Mobile"
            >
              {navItems.map((item) => (
                <button
                  className={activePanel === "home" && activeSection === item.id ? "active" : ""}
                  type="button"
                  key={item.title}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.title}
                </button>
              ))}
              <button
                className={activePanel === "profile" ? "active" : ""}
                type="button"
                onClick={() => {
                  setActivePanel("profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </button>
              <button type="button" onClick={onLogout}>
                Logout
              </button>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <div className="dashboard-hero-wrap">
        {activePanel === "home" ? (
          <section className="dashboard-hero">
            <img src={dashboardHeroImage} alt="Welcome back to MoneyPlus" />
          </section>
        ) : null}

        <motion.section id="home-top" className="welcome-block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <h1>
            Hello, {data.user.first_name}! <span>{"\u{1F44B}"}</span>
          </h1>
          <p>Find the best financial solutions for you</p>
        </motion.section>
      </div>

      <div className="dashboard-frame">
        <AnimatePresence mode="wait">
        {activePanel === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.section
              className="promo-banner panel"
              role="button"
              tabIndex={0}
              onClick={() => scrollToSection("offers-section")}
              onKeyDown={(event) => event.key === "Enter" && scrollToSection("offers-section")}
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              style={{ backgroundImage: `url(${promoBannerBg})` }}
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
              <ServicesOrbit products={data.products} onSelect={openProductPanel} />
            </motion.section>

            <motion.section
              id="offers-section"
              className="services-section"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="workspace-header">
                <h2>Recommended Offers</h2>
                <p>Latest partner products based on your dashboard profile.</p>
              </div>
              <OffersPanel products={data.products} onOpenProduct={openProductPanel} />
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
              id="calculators-section"
              className="services-section"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="workspace-header">
                <h2>Calculators</h2>
                <p>Plan your loan before you apply.</p>
              </div>
              <CalculatorsPanel onTalkToExpert={() => setActivePanel("expert")} />
            </motion.section>

            <WhyChooseSection />

            <motion.section
              id="applications-section"
              className="services-section"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="workspace-header">
                <h2>My Applications</h2>
                <p>Track every application and continue any pending loan journey.</p>
              </div>
              <ApplicationsPanel applications={applications} onOpenProduct={openProductPanel} />
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

            <HowItWorksSection />
            <TestimonialsSection />
            <FaqSection />
          </motion.div>
        ) : (
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <section className="workspace-card panel">{renderWorkspace()}</section>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {activePanel === "home" ? <MarketingFooter /> : null}
    </main>
  );
}

function WorkspacePanel({ title, subtitle, children }) {
  return (
    <div className="workspace-shell">
      <motion.div className="workspace-header" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </motion.div>
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
    <motion.div className="application-list" variants={revealStagger} initial="hidden" animate="show">
      {applications.map((application) => (
        <motion.article className="application-row" key={application.id} variants={revealUp} whileHover={{ y: -2 }}>
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
        </motion.article>
      ))}
    </motion.div>
  );
}

const offerCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 16 } },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
};

function OffersPanel({ products, onOpenProduct }) {
  return (
    <motion.div className="offer-grid" variants={revealStagger} initial="hidden" whileInView="show" viewport={revealViewport}>
      {products.slice(0, 6).map((product) => (
        <motion.button
          className="offer-card"
          type="button"
          key={product.rank}
          onClick={() => onOpenProduct(product)}
          variants={offerCardVariants}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          style={productOfferArtMap[product.title] ? { backgroundImage: `url(${productOfferArtMap[product.title]})` } : undefined}
        >
          <span className="offer-card-dots" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="offer-card-icon">
            <MiniIcon kind={productOfferIconMap[product.title] || "star"} />
          </span>
          <div className="offer-card-body">
            <strong>{product.title}</strong>
            <p>{product.subtitle}</p>
            <span className="offer-card-pill">{product.features[0]}</span>
          </div>
          <motion.span className="offer-card-arrow" aria-hidden="true" variants={{ hover: { x: 3 } }}>
            →
          </motion.span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function ProfilePanel({ user, notifications, onLogout, onOpenPanel, onDeleteAccount }) {
  const profileRows = [
    ["Full Name", `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`],
    ["Mobile Number", user.mobile],
    ["Email", user.email || "Not available"],
    ["Role", user.role],
  ];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canConfirmDelete = confirmText === user.mobile;

  function closeConfirm() {
    if (deleting) return;
    setConfirmOpen(false);
    setConfirmText("");
    setDeleteError("");
  }

  async function handleConfirmDelete(event) {
    event.preventDefault();
    if (!canConfirmDelete || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await onDeleteAccount();
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="profile-shell">
      <motion.div className="profile-grid" variants={revealStagger} initial="hidden" animate="show">
        {profileRows.map(([label, value]) => (
          <motion.div className="profile-item" key={label} variants={revealUp}>
            <span>{label}</span>
            <strong>{value}</strong>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="more-grid" variants={revealStagger} initial="hidden" animate="show">
        <motion.button className="more-card" type="button" onClick={() => onOpenPanel("notifications")} variants={revealUp} whileHover={{ y: -3 }}>
          <strong>Notifications</strong>
          <span>{notifications.length} recent updates</span>
        </motion.button>
        <motion.button className="more-card" type="button" onClick={() => onOpenPanel("security")} variants={revealUp} whileHover={{ y: -3 }}>
          <strong>Security Center</strong>
          <span>Review privacy and platform safeguards</span>
        </motion.button>
        <motion.button className="more-card logout" type="button" onClick={onLogout} variants={revealUp} whileHover={{ y: -3 }}>
          <strong>Logout</strong>
          <span>Sign out of the dashboard</span>
        </motion.button>
      </motion.div>

      <motion.div className="danger-zone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="danger-zone-header">
          <strong>Danger Zone</strong>
          <p>Actions here are permanent and cannot be undone.</p>
        </div>
        <div className="danger-zone-row">
          <div>
            <strong>Delete this account</strong>
            <p>Permanently remove your MoneyPlus profile, credit score history, and application data from our servers.</p>
          </div>
          <button className="danger-button" type="button" onClick={() => setConfirmOpen(true)}>
            Delete Account
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmOpen ? (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeConfirm}
          >
            <motion.form
              className="modal-card danger-modal"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleConfirmDelete}
            >
              <h3>Delete your account?</h3>
              <p>
                This will permanently delete the <strong>{user.first_name}{user.last_name ? ` ${user.last_name}` : ""}</strong> account
                and remove your profile, credit score history, and saved applications from our servers.{" "}
                <strong>This action cannot be undone.</strong>
              </p>
              <label className="text-field">
                <span>
                  Type your mobile number <strong>{user.mobile}</strong> to confirm.
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder={user.mobile}
                  autoFocus
                />
              </label>
              {deleteError ? <p className="error-text">{deleteError}</p> : null}
              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={closeConfirm} disabled={deleting}>
                  Cancel
                </button>
                <button className="danger-button" type="submit" disabled={!canConfirmDelete || deleting}>
                  {deleting ? "Deleting..." : "Permanently Delete Account"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function AnimatedCurrency({ value }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (current) => setDisplay(current),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value]);

  return <strong>{formatCurrency(Math.round(display))}</strong>;
}

function CalculatorsPanel({ onTalkToExpert }) {
  return (
    <motion.div className="calculators-shell" variants={revealStagger} initial="hidden" animate="show">
      <motion.div className="calculator-block" variants={revealUp}>
        <h3>Eligibility Check</h3>
        <p className="calculator-intro">Estimate how much you may qualify for before applying.</p>
        <EligibilityPanel />
      </motion.div>
      <motion.div className="calculator-block" variants={revealUp}>
        <h3>EMI Calculator</h3>
        <p className="calculator-intro">Plan your monthly outflow before you submit a loan application.</p>
        <EmiPanel />
      </motion.div>
      <motion.div className="calculator-cta" variants={revealUp}>
        <div>
          <strong>Need help deciding?</strong>
          <p>Talk to one of our loan specialists for personalised guidance.</p>
        </div>
        <button className="outline-button" type="button" onClick={onTalkToExpert}>
          Talk to Expert
        </button>
      </motion.div>
    </motion.div>
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
        <AnimatedCurrency value={eligibleAmount} />
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
        <AnimatedCurrency value={Math.round(emi || 0)} />
        <p>Total repayment planning becomes easier when you compare EMI with your existing monthly obligations.</p>
      </div>
    </div>
  );
}

function AnimatedScoreNumber({ score }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    return () => controls.stop();
  }, [inView, score]);

  return <strong ref={ref}>{display}</strong>;
}

function CreditPanel({ creditScore, scoreSegments, scoreInsight }) {
  const isStrong = creditScore.score >= 750;
  return (
    <div className="credit-detail">
      <motion.div className="score-layout" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="score-ring" style={{ "--progress": `${scoreSegments}%` }}>
          <div className="score-ring-inner">
            <AnimatedScoreNumber score={creditScore.score} />
            <span>{creditScore.label}</span>
          </div>
        </div>
        <div className="score-meta">
          <p>Last updated</p>
          <strong>{creditScore.last_updated}</strong>
          <p className="score-insight">{scoreInsight}</p>
        </div>
      </motion.div>

      <motion.div className="insight-grid" variants={revealStagger} initial="hidden" animate="show">
        <motion.div className="insight-card" variants={revealUp} whileHover={{ y: -3 }}>
          <span>Current Score</span>
          <strong>{creditScore.score}</strong>
          <p>{creditScore.label} profile. Last refreshed on {creditScore.last_updated}.</p>
        </motion.div>
        <motion.div className="insight-card" variants={revealUp} whileHover={{ y: -3 }}>
          <span>Lender Impact</span>
          <strong>{isStrong ? "Better pricing likely" : "Improve score for stronger approval odds"}</strong>
          <p>{isStrong ? "You may qualify for more competitive interest offers." : "Timely repayments and lower utilization can improve approval quality."}</p>
        </motion.div>
        <motion.div className="insight-card" variants={revealUp} whileHover={{ y: -3 }}>
          <span>Recommended Next Step</span>
          <strong>{isStrong ? "Proceed with application" : "Check eligibility first"}</strong>
          <p>{isStrong ? "Use the services grid to submit an application." : "Run an eligibility and EMI check before applying."}</p>
        </motion.div>
      </motion.div>
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
      <AnimatePresence>
        {submitted ? (
          <motion.p
            className="info-text"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Callback request saved. An expert will reach out based on your preferred slot.
          </motion.p>
        ) : null}
      </AnimatePresence>
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
      <motion.div className="requirements-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
      </motion.div>

      {loading ? <p className="empty-copy">Finding the best offers for you...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && result ? (
        <>
          <div className="offers-list-header">
            <strong>{result.eligible_count} Offers Found</strong>
            <span>Sort by: Interest Rate</span>
          </div>

          {offers.length ? (
            <motion.div className="lender-list" variants={revealStagger} initial="hidden" animate="show">
              {visibleOffers.map((offer) => (
                <motion.article className="lender-card" key={offer.rank} variants={revealUp} whileHover={{ y: -3 }}>
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
                </motion.article>
              ))}
            </motion.div>
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
      <AnimatePresence>
        {submitted ? (
          <motion.p
            className="info-text"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Application submitted. Check “My Applications” for status updates.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}

function SecurityPanel() {
  const cards = [
    { title: "Encrypted Data", body: "Profile and application details are protected with controlled storage and secure transit." },
    { title: "OTP Access", body: "Every dashboard login requires mobile OTP verification before the user session is restored." },
    { title: "Audit Friendly", body: "The onboarding flow captures required identity details once and keeps application actions traceable." },
  ];

  return (
    <motion.div className="security-grid" variants={revealStagger} initial="hidden" animate="show">
      {cards.map((card) => (
        <motion.div className="security-card" key={card.title} variants={revealUp} whileHover={{ y: -3 }}>
          <strong>{card.title}</strong>
          <p>{card.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function NotificationsPanel({ notifications }) {
  return (
    <motion.div className="application-list" variants={revealStagger} initial="hidden" animate="show">
      {notifications.map((notification) => (
        <motion.article className="application-row" key={notification.title} variants={revealUp} whileHover={{ y: -2 }}>
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.description}</p>
          </div>
          <div className="application-side">
            <span className="status-pill">{notification.time}</span>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

export default DashboardPage;
