import "@testing-library/jest-dom";
import "resize-observer-polyfill";

if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}
