import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "../icons";

function MarketingNavbar() {
  const { scrollY } = useScroll();

  const navBackground = useTransform(scrollY, [0, 90], ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.94)"]);
  const navBlur = useTransform(scrollY, [0, 90], ["blur(6px)", "blur(18px)"]);
  const navShadow = useTransform(
    scrollY,
    [0, 90],
    ["0 0 0 rgba(20, 10, 5, 0)", "0 12px 30px rgba(20, 10, 5, 0.1)"]
  );
  const navBorder = useTransform(scrollY, [0, 90], ["rgba(255,255,255,0.35)", "rgba(255,148,113,0.18)"]);

  return (
    <motion.header
      className="marketing-navbar"
      style={{ backgroundColor: navBackground, backdropFilter: navBlur, boxShadow: navShadow, borderColor: navBorder }}
    >
      <div className="marketing-navbar-inner">
        <a className="marketing-navbar-brand" href="#top">
          <Logo />
        </a>
      </div>
    </motion.header>
  );
}

export default MarketingNavbar;
