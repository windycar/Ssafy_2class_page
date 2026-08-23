import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BaseballSoloGameV2 } from "./components/games/baseball/v2/BaseballSoloGameV2";

document.documentElement.style.background = "#eef4f9";
document.body.style.margin = "0";
document.body.style.minWidth = "320px";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BaseballSoloGameV2 onExit={() => undefined} playerName="테스트 1P" seed={20260823} />
  </StrictMode>,
);
