export const showcaseStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export const authCardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export const stepVariants = {
  hidden: { opacity: 0, x: 18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: "easeOut" } },
  exit: { opacity: 0, x: -18, transition: { duration: 0.2, ease: "easeIn" } },
};

// Generic scroll-reveal pair used by every marketing section + the dashboard home panel.
// Same easing/duration family as fadeUpItem/showcaseStagger so the whole site reads as one
// motion language instead of three unrelated ones.
export const revealUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const revealStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const floatBlob = {
  animate: { y: [0, -18, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
};

export const revealViewport = { once: true, amount: 0.2 };
