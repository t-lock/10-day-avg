import "./app.css";
import App from "./App.svelte";
import "./lib/services/expiry";

const app = new App({
  target: document.getElementById("app") as HTMLElement,
});

export default app;
