import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-fallback" role="alert">
          <p className="eyebrow">Atlas connection interrupted</p>
          <h1>The page hit a problem.</h1>
          <p>Reload the page to try again. Your locally saved topic progress is kept in this browser.</p>
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Reload Quantum Atlas</button>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </React.StrictMode>,
);
