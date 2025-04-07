// src/utils/errorTracker.ts

let totalRequests = 0;
let totalErrors = 0;

export const errorTracker = {
  recordRequest() {
    totalRequests++;
  },

  recordError() {
    totalErrors++;
  },

  getStats() {
    return {
      totalRequests,
      totalErrors,
      actualErrorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
    };
  },

  reset() {
    totalRequests = 0;
    totalErrors = 0;
  },
};
