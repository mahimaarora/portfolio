const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

const handlers = {};
const classes = new Set();
let interval;
const verb = { textContent: "Thinking" };
const spinner = { textContent: "✻" };
const toggle = { addEventListener: (_, callback) => { handlers.click = callback; } };
const reducedMotion = { matches: false, addEventListener: (_, callback) => { handlers.motion = callback; } };
const document = {
  hidden: false,
  getElementById: (id) => ({ verb, spinner, "motion-toggle": toggle })[id],
  documentElement: { classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) } },
  addEventListener: (_, callback) => { handlers.visibility = callback; },
};

runInNewContext(readFileSync(join(__dirname, "../site/agent.js"), "utf8"), {
  document, window: { matchMedia: () => reducedMotion }, Math,
  setInterval: (callback, delay) => {
    assert.equal(delay, 100);
    interval = callback;
    return 1;
  },
  clearInterval: () => { interval = undefined; },
});

const cycle = [];
for (let i = 0; i < 20; i++) { interval(); cycle.push(spinner.textContent); }
assert.deepEqual(new Set(cycle), new Set(["·", "✢", "✳", "✶", "✻", "✽"]));
assert.equal(cycle[0], "·");
assert.equal(cycle[9], "✽");
assert.equal(cycle[19], "·");
assert.equal(verb.textContent, "Thinking", "The word holds through a complete bloom");

for (let i = 0; i < 100; i++) {
  const previous = verb.textContent;
  for (let tick = 0; tick < 40; tick++) interval();
  assert.notEqual(verb.textContent, previous, "Consecutive verbs must differ");
}

handlers.click();
assert.equal(interval, undefined);
assert(classes.has("is-paused"));
assert.equal(toggle.textContent, "Resume animation");
handlers.click();
assert.equal(typeof interval, "function");

reducedMotion.matches = true;
handlers.motion();
assert.equal(interval, undefined);
assert.equal(toggle.hidden, true);
assert.equal(spinner.textContent, "✻");
reducedMotion.matches = false;
handlers.motion();
assert.equal(typeof interval, "function");

document.hidden = true;
handlers.visibility();
assert.equal(interval, undefined);
document.hidden = false;
handlers.visibility();
assert.equal(typeof interval, "function");

console.log("Animation checks passed: six-frame bloom, verbs, pause, reduced motion, and hidden tabs.");
