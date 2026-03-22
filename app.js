/**
 * Client-side gate only — fine for a sweet surprise, not for real secrets.
 * Add more reasons anytime — keep them short and sweet.
 * Each click: next animal speaks + next message (wraps around).
 */
const AUTH_KEY = "forSalynaUnlocked";
const PASSWORD = "salyna";

const gateScreen = document.getElementById("gate-screen");
const appContent = document.getElementById("app-content");
const gateForm = document.getElementById("gate-form");
const gatePassword = document.getElementById("gate-password");
const gateError = document.getElementById("gate-error");

function unlockApp() {
  sessionStorage.setItem(AUTH_KEY, "1");
  gateScreen.hidden = true;
  appContent.hidden = false;
  gateError.textContent = "";
  const cta = document.getElementById("next-btn");
  if (cta) cta.focus();
  requestAnimationFrame(() => alignBubbleTail());
}

function checkAuth() {
  if (sessionStorage.getItem(AUTH_KEY) === "1") {
    gateScreen.hidden = true;
    appContent.hidden = false;
    return true;
  }
  gateScreen.hidden = false;
  appContent.hidden = true;
  gatePassword.focus();
  return false;
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  gateError.textContent = "";
  const value = gatePassword.value.trim().toLowerCase();
  if (value === PASSWORD) {
    unlockApp();
    gatePassword.value = "";
  } else {
    gateError.textContent = "Not quite — try again, love.";
    gatePassword.select();
  }
});

checkAuth();

const MESSAGES = [
  "Salyna, I love that you always support me.",
  "Salyna, you are the kindest, most compassionate person I know.",
  "Salyna, you are sexxxxxxxy ;)",
  "Salyna, I love your smile.",
  "Salyna, you do so many little things for me that make my day.",
  "Salyna, you constantly remind me why I love you with all the things that you do.",
  "Salyna, you make my hard days less hard.",
  "Salyna, I'm so grateful for you. Your warmth, your love, your steadiness.",
  "Salyna, I notice the effort you put in, and it means more than you know.",
  "Salyna, you are stunning. I don't know how I got so lucky!",
  "Salyna, your kindness shows up in the small moments, and those moments stack into something huge in my life.",
  "Salyna, you remember the details that everyone else forgets, and that makes me feel unbelievably cared for.",
];

const SPEAKERS = [
  { id: "penguin", label: "Polly the Penguin says…" },
  { id: "panda", label: "Pongu the Panda says…" },
  { id: "chow", label: "Nala the fluffy Chow Chow says…" },
];

const BOOP_TEXT = {
  penguin: "Polly says boop!",
  panda: "Pongu sends a little hug.",
  chow: "Nala goes full floof!",
};

const messageEl = document.getElementById("message-text");
const speakerEl = document.getElementById("speaker-label");
const bubbleEl = document.getElementById("message-bubble");
const critterReactionEl = document.getElementById("critter-reaction");
const btn = document.getElementById("next-btn");
const critters = document.querySelectorAll(".critter");

let step = 0;
let boopTimeoutId = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function triggerBubblePop() {
  if (!bubbleEl || prefersReducedMotion()) return;
  bubbleEl.classList.remove("bubble--pop");
  void bubbleEl.offsetWidth;
  bubbleEl.classList.add("bubble--pop");
  const onEnd = () => {
    bubbleEl.classList.remove("bubble--pop");
  };
  bubbleEl.addEventListener("animationend", onEnd, { once: true });
}

function alignBubbleTail() {
  if (!bubbleEl) return;
  const active = document.querySelector(".critter.is-active");
  if (!active) {
    bubbleEl.style.setProperty("--bubble-tail-pct", "50%");
    return;
  }
  const br = bubbleEl.getBoundingClientRect();
  const ar = active.getBoundingClientRect();
  const cx = ar.left + ar.width / 2;
  let pct = ((cx - br.left) / br.width) * 100;
  pct = Math.min(92, Math.max(8, pct));
  bubbleEl.style.setProperty("--bubble-tail-pct", `${pct}%`);
}

function setActiveCritter(id) {
  critters.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.critter === id);
    el.classList.remove("critter--boop");
  });
  if (critterReactionEl) critterReactionEl.textContent = "";
  clearTimeout(boopTimeoutId);
}

function showStep(index) {
  const speaker = SPEAKERS[index % SPEAKERS.length];
  const text = MESSAGES[index % MESSAGES.length];
  speakerEl.textContent = speaker.label;
  messageEl.textContent = text;
  setActiveCritter(speaker.id);
  triggerBubblePop();
}

critters.forEach((critterBtn) => {
  critterBtn.addEventListener("click", () => {
    const id = critterBtn.dataset.critter;
    critters.forEach((c) => c.classList.remove("critter--boop"));
    critterBtn.classList.add("critter--boop");
    if (critterReactionEl) {
      critterReactionEl.textContent = BOOP_TEXT[id] || "";
    }
    clearTimeout(boopTimeoutId);
    boopTimeoutId = window.setTimeout(() => {
      critterBtn.classList.remove("critter--boop");
      if (critterReactionEl) critterReactionEl.textContent = "";
    }, 1500);
  });
});

btn.addEventListener("click", () => {
  showStep(step);
  step += 1;
});

let bubbleTailResizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(bubbleTailResizeTimer);
  bubbleTailResizeTimer = window.setTimeout(alignBubbleTail, 100);
});

if (sessionStorage.getItem(AUTH_KEY) === "1") {
  requestAnimationFrame(() => {
    alignBubbleTail();
    requestAnimationFrame(alignBubbleTail);
  });
}
