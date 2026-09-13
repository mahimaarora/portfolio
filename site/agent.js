const verbs = [
  "Thinking", "Doing", "Toomfoolering", "Building", "Pondering",
  "Tinkering", "Conjuring", "Percolating", "Cogitating", "Noodling",
  "Mulling", "Dreaming", "Brewing", "Assembling", "Daydreaming",
  "Sketching", "Untangling", "Imagining", "Connecting dots", "Scheming",
  "Marinating", "Finagling", "Orchestrating", "Making magic",
];

const frames = ["·", "✢", "✳", "✶", "✻", "✽"];
const spinner = document.getElementById("spinner");
const verb = document.getElementById("verb");
const toggle = document.getElementById("motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let current = 0;
let elapsed = 0;
let motionEnabled = !reducedMotion.matches;
let interval;

function animate() {
  elapsed += 100;
  // A two-second bloom: dot to star and back, with longer holds at the ends.
  const bloom = (1 - Math.cos(2 * Math.PI * elapsed / 2000)) / 2;
  spinner.textContent = frames[Math.round(bloom * (frames.length - 1))];
  if (elapsed % 4000 === 0) {
    current = (current + 1 + Math.floor(Math.random() * (verbs.length - 1))) % verbs.length;
    verb.textContent = verbs[current];
  }
}

function updateMotion() {
  clearInterval(interval);
  const paused = !motionEnabled || document.hidden;
  document.documentElement.classList.toggle("is-paused", paused);
  document.documentElement.classList.toggle("motion-enabled", motionEnabled);
  toggle.hidden = false;
  toggle.textContent = motionEnabled ? "Pause animation" : "Play animation";
  if (!paused) interval = setInterval(animate, 100);
}

function updateDevicePreference() {
  motionEnabled = !reducedMotion.matches;
  updateMotion();
}

toggle.addEventListener("click", () => {
  motionEnabled = !motionEnabled;
  updateMotion();
});
if (typeof reducedMotion.addEventListener === "function") {
  reducedMotion.addEventListener("change", updateDevicePreference);
} else {
  reducedMotion.addListener(updateDevicePreference);
}
document.addEventListener("visibilitychange", updateMotion);
window.addEventListener("pageshow", updateMotion);
updateMotion();
