import "@testing-library/jest-dom";

// Mock ResizeObserver — used by Radix UI, not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
