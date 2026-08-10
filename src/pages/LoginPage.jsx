import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { registerUser, sendOtp, verifyOtp } from "../api/client";
import { authCardVariants, fadeUpItem, floatBlob, showcaseStagger, stepVariants } from "../animations";
import { Logo, LockIcon, MiniIcon } from "../components/icons";
import MarketingNavbar from "../components/marketing/MarketingNavbar";
import LendingPartnersSection from "../components/marketing/LendingPartnersSection";
import StatsSection from "../components/marketing/StatsSection";
import ServicesSection from "../components/marketing/ServicesSection";
import WhyChooseSection from "../components/marketing/WhyChooseSection";
import HowItWorksSection from "../components/marketing/HowItWorksSection";
import TestimonialsSection from "../components/marketing/TestimonialsSection";
import FaqSection from "../components/marketing/FaqSection";
import CtaBanner from "../components/marketing/CtaBanner";
import MarketingFooter from "../components/marketing/MarketingFooter";
import heroIllustrationImage from "../assets/ChatGPT Image Aug 10, 2026, 11_33_15 AM.png";

const onboardingSteps = [
  { key: "mobile", label: "Mobile" },
  { key: "otp", label: "OTP" },
  { key: "details", label: "Details" },
];

const trustFeatures = [
  { title: "Quick Approval", subtitle: "Get approved in minutes", icon: "bolt" },
  { title: "Low Interest", subtitle: "Competitive rates you can trust", icon: "percent" },
  { title: "Safe & Secure", subtitle: "Your data is 100% protected", icon: "shield" },
];

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
        <motion.form
          key={step}
          className="auth-form"
          variants={stepVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          onSubmit={step === "mobile" ? handleSendOtp : handleVerifyOtp}
        >
          <label className="field-card">
            <div className="field-leading">
              <span className="flag-india" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="country-code">+91</span>
              <span className="country-chevron" aria-hidden="true">▾</span>
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
              placeholder={step === "mobile" ? "Enter mobile number" : "Enter OTP"}
              aria-label={step === "mobile" ? "Mobile number" : "OTP"}
            />
            <span className="digit-count">
              {step === "mobile" ? `${formattedDigits.length} / 10` : `${otp.length} / 6`}
            </span>
          </label>

          <motion.button
            className="primary-button"
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.015 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
          >
            <span>{loading ? "Please wait..." : step === "mobile" ? "Send OTP" : "Verify OTP"}</span>
            {!loading ? (
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </motion.button>

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
        </motion.form>
      );
    }

    return (
      <motion.form
        key={step}
        className="auth-form"
        variants={stepVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        onSubmit={handleRegister}
      >
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
          <motion.button
            className="primary-button"
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.015 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
          >
            {loading ? "Creating your profile..." : "Complete Registration"}
          </motion.button>
        </div>
      </motion.form>
    );
  }

  return (
    <div className="login-page-theme">
      <MarketingNavbar />

      <main
        className="auth-shell"
        id="top"
        style={{
          "--login-bg-desktop": `url(${heroIllustrationImage})`,
          "--login-bg-mobile": `url(${heroIllustrationImage})`,
        }}
      >
        <div className="auth-scrim" />
        <motion.span
          className="auth-blob auth-blob-1"
          variants={floatBlob}
          animate="animate"
          aria-hidden="true"
        />
        <motion.span
          className="auth-blob auth-blob-2"
          variants={floatBlob}
          animate="animate"
          transition={{ delay: 1.2 }}
          aria-hidden="true"
        />
        <section className="auth-stage">
          <div className="auth-showcase">
            <motion.div
              className="showcase-panel"
              variants={showcaseStagger}
              initial="hidden"
              animate="show"
            >
              <motion.div className="brand-block auth-brand" variants={fadeUpItem}>
                <Logo />
              </motion.div>

              <motion.div className="hero-eyebrow-row" variants={fadeUpItem}>
                <span className="hero-eyebrow">Simple Loans, Better Lives</span>
                <span className="hero-eyebrow-rule" aria-hidden="true" />
              </motion.div>

              <motion.div className="hero-copy" variants={fadeUpItem}>
                <h1>
                  <span className="hero-line-primary">Smart Loans</span>
                  <br />
                  <span className="hero-line-accent">for Every Need</span>
                </h1>
                <span className="hero-rule" aria-hidden="true" />
                <p>MoneyPlus helps you achieve your dreams with fast, flexible and hassle-free loans.</p>
              </motion.div>

              <motion.div className="feature-row" aria-hidden="true" variants={fadeUpItem}>
                {trustFeatures.map((feature) => (
                  <div className="feature-item" key={feature.title}>
                    <span className="feature-icon">
                      <MiniIcon kind={feature.icon} />
                    </span>
                    <div className="feature-copy">
                      <strong>{feature.title}</strong>
                      <span>{feature.subtitle}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div className="trust-badge" variants={fadeUpItem}>
                <span className="trust-badge-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                Trusted by 50,000+ customers across India
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="auth-card"
            id="login-card"
            variants={authCardVariants}
            initial="hidden"
            animate="show"
          >
            <div className="auth-card-header centered">
              <Logo />
              <p className="welcome-kicker">
                {step === "mobile" ? "Welcome Back!" : "Associate Login"}
              </p>
              <h2>
                {step === "mobile" && "Login to your Associate account"}
                {step === "otp" && "Verify your OTP"}
                {step === "details" && "Complete your basic details"}
              </h2>
            </div>

            <AnimatePresence mode="wait">{renderStepForm()}</AnimatePresence>

            <AnimatePresence>
              {message ? (
                <motion.p
                  className="info-text"
                  key={`message-${message}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {message}
                </motion.p>
              ) : null}
              {error ? (
                <motion.p
                  className="error-text"
                  key={`error-${error}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0], y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <p className="auth-security-note">
              <LockIcon />
              Your data is safe and secure with us
            </p>

            <p className="disclaimer">
              By continuing, you agree to the <a href="#login-card">Privacy Policy</a> and <a href="#login-card">Terms of Use</a>.
            </p>
          </motion.div>
        </section>
      </main>

      <LendingPartnersSection />
      <StatsSection />
      <ServicesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
      <MarketingFooter />
    </div>
  );
}

export default LoginPage;
