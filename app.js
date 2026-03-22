/**
 * Client-side gate only — fine for a sweet surprise, not for real secrets.
 * Add more reasons anytime — keep them short and sweet.
 * Each click: random animal + random message (won’t repeat the same line or speaker twice in a row).
 */
const AUTH_KEY = "forSalynaUnlocked";
const PASSWORD = "salyna";

const gateScreen = document.getElementById("gate-screen");
const appContent = document.getElementById("app-content");
const gateForm = document.getElementById("gate-form");
const gatePassword = document.getElementById("gate-password");
const gateError = document.getElementById("gate-error");

function scrollMainIntoView() {
  const main = document.getElementById("love-note-main");
  if (!main) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  main.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function unlockApp() {
  sessionStorage.setItem(AUTH_KEY, "1");
  gateScreen.hidden = true;
  appContent.hidden = false;
  gateError.textContent = "";
  requestAnimationFrame(() => {
    scrollMainIntoView();
    requestAnimationFrame(() => {
      alignBubbleTail();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cta = document.getElementById("next-btn");
      if (cta) {
        window.setTimeout(
          () => {
            cta.focus({ preventScroll: true });
          },
          reduce ? 0 : 420,
        );
      }
    });
  });
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
  "Salyna, you're the most beautiful girl I've ever seen.",
  "Salyna, you're my biggest cheerleader, and I love you so much for it.",
  "Salyna, your kindness isn't just for show. It's who you are, and I love that about you.",
  "Salyna, home is wherever I am with you.",
  "Salyna, you are my forever travel partner :)",
  "Salyna, I love that you love Pumba and Nala as much as I do.",
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

let lastSpeakerIdx = -1;
let lastMsgIdx = -1;
let boopTimeoutId = 0;

function randomIndexExcluding(length, exclude) {
  if (length <= 1) return 0;
  let i;
  let guard = 0;
  do {
    i = Math.floor(Math.random() * length);
    guard += 1;
  } while (i === exclude && guard < 32);
  return i;
}

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
  const face = active.querySelector(".critter-face");
  const target = face || active;
  const br = bubbleEl.getBoundingClientRect();
  const ar = target.getBoundingClientRect();
  if (br.width <= 0) return;
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
  requestAnimationFrame(() => {
    alignBubbleTail();
    requestAnimationFrame(alignBubbleTail);
  });
}

function showRandomNote() {
  const si = randomIndexExcluding(SPEAKERS.length, lastSpeakerIdx);
  const mi = randomIndexExcluding(MESSAGES.length, lastMsgIdx);
  lastSpeakerIdx = si;
  lastMsgIdx = mi;
  const speaker = SPEAKERS[si];
  const text = MESSAGES[mi];
  speakerEl.textContent = speaker.label;
  messageEl.textContent = text;
  setActiveCritter(speaker.id);
  triggerBubblePop();
  window.setTimeout(alignBubbleTail, 0);
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

if (btn) {
  btn.addEventListener("click", () => {
    showRandomNote();
  });
}

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
