import Phaser from 'phaser';

import { Preloader } from './src/scene/Preloader';
import { Start } from './src/scene/Start';
import { Runner } from './src/scene/Runner';

const runnerConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320, // 1334
  height: 320, // 750
  scene: [Preloader, Start, Runner],
  physics: {
    default: 'arcade',
  },
  parent: 'game',
};

const runner = new Phaser.Game(runnerConfig);
