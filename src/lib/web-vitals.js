/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals metrics for SEO and performance optimization
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint): Should be < 2.5s
 * - INP (Interaction to Next Paint): Should be < 200ms
 * - CLS (Cumulative Layout Shift): Should be < 0.1
 * - FCP (First Contentful Paint): Should be < 1.8s
 * - TTFB (Time to First Byte): Should be < 800ms
 */

// Simple performance observer for Core Web Vitals
const vitalsLog = [];

// Report vital to console in development
function reportVital(metric) {
  const { name, value, rating } = metric;

  // Rating thresholds based on Google's guidelines
  const ratingEmoji = {
    good: '🟢',
    'needs-improvement': '🟡',
    poor: '🔴'
  };

  const entry = {
    name,
    value: Math.round(value * 100) / 100,
    rating,
    timestamp: new Date().toISOString()
  };

  vitalsLog.push(entry);

  // Log in development
  if (import.meta.env.DEV) {
    console.log(
      `${ratingEmoji[rating] || '⚪'} ${name}: ${entry.value}${name === 'CLS' ? '' : 'ms'} (${rating})`
    );
  }

  // In production, you could send to analytics
  // sendToAnalytics(entry);
}

// Get rating for each metric based on Google's thresholds
function getRating(name, value) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  };

  const threshold = thresholds[name];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Observe LCP (Largest Contentful Paint)
function observeLCP() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      reportVital({
        name: 'LCP',
        value: lastEntry.startTime,
        rating: getRating('LCP', lastEntry.startTime)
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }
}

// Observe CLS (Cumulative Layout Shift)
function observeCLS() {
  if (!('PerformanceObserver' in window)) return;

  let clsValue = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      reportVital({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue)
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // CLS not supported
  }
}

// Observe FCP (First Contentful Paint)
function observeFCP() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        reportVital({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime)
        });
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // FCP not supported
  }
}

// Observe INP (Interaction to Next Paint)
function observeINP() {
  if (!('PerformanceObserver' in window)) return;

  let maxINP = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > maxINP) {
          maxINP = entry.duration;

          reportVital({
            name: 'INP',
            value: maxINP,
            rating: getRating('INP', maxINP)
          });
        }
      }
    });

    observer.observe({ type: 'event', buffered: true });
  } catch (e) {
    // INP not supported
  }
}

// Get TTFB (Time to First Byte)
function measureTTFB() {
  if (!('performance' in window)) return;

  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

      reportVital({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb)
      });
    }
  } catch (e) {
    // TTFB measurement failed
  }
}

// Initialize all Web Vitals monitoring
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Wait for page to be fully loaded
  if (document.readyState === 'complete') {
    startObserving();
  } else {
    window.addEventListener('load', startObserving);
  }
}

function startObserving() {
  if (import.meta.env.DEV) {
    console.log('📊 Web Vitals monitoring started');
  }

  observeLCP();
  observeCLS();
  observeFCP();
  observeINP();
  measureTTFB();
}

// Get all recorded vitals
export function getVitalsLog() {
  return vitalsLog;
}

// Export individual observers for custom use
export { observeLCP, observeCLS, observeFCP, observeINP, measureTTFB };
