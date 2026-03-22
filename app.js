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
];

const SPEAKERS = [
  { id: "penguin", label: "Polly the Penguin says…" },
  { id: "panda", label: "Pongu the Panda says…" },
  { id: "chow", label: "Nala the fluffy Chow Chow says…" },
];

const messageEl = document.getElementById("message-text");
const speakerEl = document.getElementById("speaker-label");
const btn = document.getElementById("next-btn");
const critters = document.querySelectorAll(".critter");

let step = 0;

function setActiveCritter(id) {
  critters.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.critter === id);
  });
}

function showStep(index) {
  const speaker = SPEAKERS[index % SPEAKERS.length];
  const text = MESSAGES[index % MESSAGES.length];
  speakerEl.textContent = speaker.label;
  messageEl.textContent = text;
  setActiveCritter(speaker.id);
}

btn.addEventListener("click", () => {
  showStep(step);
  step += 1;
});
