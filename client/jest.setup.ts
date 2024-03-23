import "@testing-library/jest-dom";
import "resize-observer-polyfill";

if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}

window.HTMLElement.prototype.scrollIntoView = jest.fn();

ResizeObserver = class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observations = new Map();
  }

  observe(target) {
    if (this.observations.has(target)) {
      return;
    }
    // Simulate observing an element by storing a reference to it
    this.observations.set(target, {});
  }

  unobserve(target) {
    // Remove the reference to simulate stopping observation
    this.observations.delete(target);
  }

  disconnect() {
    // Clear all observations to simulate disconnecting the observer
    this.observations.clear();
  }

  // Optionally, you can implement a trigger method to manually trigger the callback
  // This can be useful for testing how your component reacts to resize events
  trigger() {
    this.callback(
      [...this.observations.entries()].map(([target]) => ({
        target,
        contentRect: target.getBoundingClientRect(),
      })),
      this,
    );
  }
};
