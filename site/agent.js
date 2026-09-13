const verbs = [
  "Thinking", "Doing", "Toomfoolering", "Building", "Pondering",
  "Tinkering", "Conjuring", "Percolating", "Cogitating", "Noodling",
  "Mulling", "Dreaming", "Brewing", "Assembling", "Daydreaming",
  "Sketching", "Untangling", "Imagining", "Connecting dots", "Scheming",
  "Marinating", "Finagling", "Orchestrating", "Making magic",
];

const verb = document.getElementById("verb");
const toggle = document.getElementById("motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let current = 0;
let manuallyPaused = false;
let interval;
let swap;

function nextVerb() {
  verb.classList.add("is-changing");
  swap = setTimeout(() => {
    current = (current + 1 + Math.floor(Math.random() * (verbs.length - 1))) % verbs.length;
    verb.textContent = verbs[current];
    verb.classList.remove("is-changing");
  }, 160);
}

function updateMotion() {
  clearInterval(interval);
  clearTimeout(swap);
  verb.classList.remove("is-changing");
  const paused = manuallyPaused || reducedMotion.matches || document.hidden;
  document.documentElement.classList.toggle("is-paused", paused);
  toggle.hidden = reducedMotion.matches;
  toggle.textContent = manuallyPaused ? "Resume animation" : "Pause animation";
  if (!paused) interval = setInterval(nextVerb, 2400);
}

toggle.addEventListener("click", () => {
  manuallyPaused = !manuallyPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
document.addEventListener("visibilitychange", updateMotion);
updateMotion();
