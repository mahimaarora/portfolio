const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

const handlers = {};
const classes = new Set();
const wordClasses = new Set();
let interval;
let swap;
const verb = { textContent: "Thinking", classList: {
  add: (name) => wordClasses.add(name), remove: (name) => wordClasses.delete(name),
} };
const toggle = { addEventListener: (_, callback) => { handlers.click = callback; } };
const reducedMotion = { matches: false, addEventListener: (_, callback) => { handlers.motion = callback; } };
const document = {
  hidden: false,
  getElementById: (id) => id === "verb" ? verb : toggle,
  documentElement: { classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) } },
  addEventListener: (_, callback) => { handlers.visibility = callback; },
};

runInNewContext(readFileSync(join(__dirname, "../site/agent.js"), "utf8"), {
  document, window: { matchMedia: () => reducedMotion }, Math,
  setInterval: (callback) => { interval = callback; return 1; },
  clearInterval: () => { interval = undefined; },
  setTimeout: (callback) => { swap = callback; return 2; },
  clearTimeout: () => { swap = undefined; },
});

assert.equal(toggle.hidden, false);
for (let i = 0; i < 100; i++) {
  const previous = verb.textContent;
  interval();
  assert(wordClasses.has("is-changing"));
  swap();
  assert.notEqual(verb.textContent, previous, "Consecutive verbs must differ");
  assert(!wordClasses.has("is-changing"));
}

interval();
handlers.click();
assert.equal(interval, undefined);
assert.equal(swap, undefined, "Pausing cancels a pending word change");
assert(!wordClasses.has("is-changing"), "A paused word stays visible");
assert(classes.has("is-paused"));
assert.equal(toggle.textContent, "Resume animation");
handlers.click();
assert.equal(typeof interval, "function");

reducedMotion.matches = true;
handlers.motion();
assert.equal(interval, undefined);
assert.equal(toggle.hidden, true);
reducedMotion.matches = false;
handlers.motion();
assert.equal(typeof interval, "function");

document.hidden = true;
handlers.visibility();
assert.equal(interval, undefined);
document.hidden = false;
handlers.visibility();
assert.equal(typeof interval, "function");

console.log("Animation checks passed: rotation, pause, reduced motion, and hidden tabs.");
