import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";

if (window.location.protocol !== "file:") {
  void import("virtual:pwa-register").then(({ registerSW }) => registerSW({ immediate: true }));
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
