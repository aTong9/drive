import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { connectWorkspaceNavigation } from "./app/workspaceNavigation.js";
import "./styles.css";
import "./journal.css";

if (window.location.protocol !== "file:") {
  void import("virtual:pwa-register").then(({ registerSW }) => registerSW({ immediate: true }));
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");
const disconnectNavigation = connectWorkspaceNavigation();
import.meta.hot?.dispose(disconnectNavigation);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
