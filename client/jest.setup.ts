//@ts-nocheck
import "@testing-library/jest-dom";
import "resize-observer-polyfill";

// Mock the global to reverse an array
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}

// Mock the global to scroll an element into view
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the ResizeObserver constructor
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

  // Trigger method to manually trigger the callback
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
