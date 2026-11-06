
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import FrontendMotion from "./components/FrontendMotion";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";

import "./styles/cinematic.css";


const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element not found.");
}

createRoot(root).render(
  <StrictMode>
    <App />
    <FrontendMotion />
  </StrictMode>,
);
