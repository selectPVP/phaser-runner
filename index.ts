import $ from "phaser";

import { Preloader } from "./src/scene/Preloader";
import { Start } from "./src/scene/Start";
import { Runner } from "./src/scene/Runner";

document.getElementById("game")?.replaceChildren();

const square_size: number = 400; // Math.min(window.innerHeight, window.innerWidth) * 0.9;

const runnerConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: square_size,
  height: square_size,
  scene: [Preloader, Start, Runner],
  physics: {
    default: "arcade",
  },
  parent: "game",
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
    // width: 800,
    // height: 600,
  },
};

const runner = new Phaser.Game(runnerConfig);
