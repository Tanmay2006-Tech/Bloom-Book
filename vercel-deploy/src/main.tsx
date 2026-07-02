import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/lib/custom-fetch";

setBaseUrl("");

const root = document.getElementById("root");
if (!root) throw new Error("BloomBook could not find its application root.");
createRoot(root).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.warn("Offline support could not be enabled", error);
    });
  });
}
