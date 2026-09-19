import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Global polyfill for CanvasRenderingContext2D.roundRect (essential for WeChat XWeb & older mobile WebViews)
if (typeof window !== 'undefined' && typeof CanvasRenderingContext2D !== 'undefined') {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (
      x: number,
      y: number,
      w: number,
      h: number,
      radii?: number | number[]
    ) {
      let r = 0;
      if (typeof radii === 'number') {
        r = radii;
      } else if (Array.isArray(radii) && radii.length > 0) {
        r = radii[0];
      }
      const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
      this.moveTo(x + radius, y);
      this.arcTo(x + w, y, x + w, y + h, radius);
      this.arcTo(x + w, y + h, x, y + h, radius);
      this.arcTo(x, y + h, x, y, radius);
      this.arcTo(x, y, x + w, y, radius);
      this.closePath();
      return this;
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

