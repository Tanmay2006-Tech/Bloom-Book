import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/lib/custom-fetch";

setBaseUrl("");

const root = document.getElementById("root");
if (!root) throw new Error("BloomBook could not find its application root.");
createRoot(root).render(<App />);
