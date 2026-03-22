/**
 * Add more reasons anytime — keep them short and sweet.
 * Each click: next animal speaks + next message (wraps around).
 */
const MESSAGES = [
  "Salyna, your laugh is my favorite sound in the whole world.",
  "Salyna, you make ordinary days feel like a holiday.",
  "Salyna, you’re the kindest person I know — and the cutest, honestly.",
  "Salyna, I love how your brain works; you’re brilliant and curious.",
  "Salyna, you’re my home. Wherever you are, I want to be.",
  "Salyna, your strength inspires me more than you know.",
  "Salyna, you’re ridiculously easy to adore.",
  "Salyna, thank you for being patient with me — I notice it.",
  "Salyna, you’re beautiful inside and out, today and every day.",
  "Salyna, I’m so proud to be yours.",
];

const SPEAKERS = [
  { id: "penguin", label: "Pip the Penguin says…" },
  { id: "panda", label: "Pandi the Panda says…" },
  { id: "chow", label: "Cinnamon the Chow Chow says…" },
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
