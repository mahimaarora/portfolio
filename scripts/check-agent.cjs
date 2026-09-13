const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");
const source = readFileSync(join(__dirname, "../site/agent.js"), "utf8");

for (const legacy of [false, true]) {
  for (const reduced of [false, true]) {
    const handlers = {};
    const classes = new Set();
    const timers = new Map();
    let timerId = 0;
    const verb = { textContent: "Thinking" };
    const spinner = { textContent: "✻" };
    const toggle = { addEventListener: (_, callback) => { handlers.click = callback; } };
    const preference = { matches: reduced };
    if (legacy) preference.addListener = (callback) => { handlers.motion = callback; };
    else preference.addEventListener = (_, callback) => { handlers.motion = callback; };
    const document = {
      hidden: false,
      getElementById: (id) => ({ verb, spinner, "motion-toggle": toggle })[id],
      documentElement: { classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) } },
      addEventListener: (_, callback) => { handlers.visibility = callback; },
    };
    runInNewContext(source, {
      document, Math,
      window: {
        matchMedia: () => preference,
        addEventListener: (event, callback) => { handlers[event] = callback; },
      },
      setInterval: (callback, delay) => {
        assert.equal(delay, 100);
        timers.set(++timerId, callback);
        return timerId;
      },
      clearInterval: (id) => { timers.delete(id); },
    });
    const tick = () => {
      assert.equal(timers.size, 1, "Only one animation timer may run");
      timers.values().next().value();
    };

    assert.equal(toggle.hidden, false, "The play control must remain available");
    if (reduced) {
      assert.equal(timers.size, 0, "Reduce Motion pauses by default");
      assert.equal(toggle.textContent, "Play animation");
      handlers.click();
      assert(classes.has("motion-enabled"), "An explicit tap can enable all motion");
    }

    const cycle = [];
    for (let i = 0; i < 20; i++) { tick(); cycle.push(spinner.textContent); }
    assert.deepEqual(new Set(cycle), new Set(["·", "✢", "✳", "✶", "✻", "✽"]));
    assert.equal(cycle[0], "·");
    assert.equal(cycle[9], "✽");
    assert.equal(cycle[19], "·");
    for (let i = 0; i < 20; i++) {
      const previous = verb.textContent;
      for (let frame = 0; frame < 40; frame++) tick();
      assert.notEqual(verb.textContent, previous);
    }

    handlers.click();
    handlers.pageshow();
    assert.equal(timers.size, 0, "Returning to a paused page must not restart it");
    assert(classes.has("is-paused"));
    assert.equal(toggle.textContent, "Play animation");
    handlers.click();
    tick();

    preference.matches = true;
    handlers.motion();
    assert.equal(timers.size, 0);
    assert.equal(toggle.hidden, false);
    handlers.click();
    tick();

    document.hidden = true;
    handlers.visibility();
    assert.equal(timers.size, 0);
    document.hidden = false;
    handlers.pageshow();
    tick();
    handlers.visibility();
    tick();
    handlers.pageshow();
    tick();
  }
}

console.log("Animation checks passed: modern/legacy Safari APIs, reduced-motion opt-in, page restore, pause, and bloom.");
