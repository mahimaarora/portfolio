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
let manuallyPaused = false;
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
  const paused = manuallyPaused || reducedMotion.matches || document.hidden;
  document.documentElement.classList.toggle("is-paused", paused);
  toggle.hidden = reducedMotion.matches;
  toggle.textContent = manuallyPaused ? "Resume animation" : "Pause animation";
  if (reducedMotion.matches) spinner.textContent = "✻";
  if (!paused) interval = setInterval(animate, 100);
}

toggle.addEventListener("click", () => {
  manuallyPaused = !manuallyPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
document.addEventListener("visibilitychange", updateMotion);
updateMotion();
