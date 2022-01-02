import { SceneKeys } from '../enums';
import { Hero } from '../Hero';
import { PlatformHandler } from '../Platform';

export class Runner extends Phaser.Scene {
  startData: { time?: number };
  startTime: number;
  timer: number = 0;
  bonus: number = 0;
  score: number = 0;
  scoreText: string;
  scoreBoard: Phaser.GameObjects.Text;
  gravity: number = 800;
  jumpForce: number = 500;
  jumpsAllowed: number = 2;
  platformHandler: PlatformHandler;
  hero: Hero;

  constructor() {
    super(SceneKeys.Runner);
  }
  create() {
    this.startData = this.scene.settings.data;
    this.startTime = this.startData?.time || this.time.now;
    this.scoreText = `Score: ${this.score}`;
    this.scoreBoard = this.add.text(5, 5, this.scoreText, {
      color: '#0f0',
    });
    this.hero = new Hero(
      this,
      <number>this.game.config.width / 3,
      <number>this.game.config.height / 2,
      this.gravity,
      this.jumpForce,
      this.jumpsAllowed
    );
    this.platformHandler = new PlatformHandler(
      this,
      this.hero.sprite.height,
      this.hero.jumpHeight,
      this.hero.jumpTime
    );
    this.platformHandler.spawn(
      <number>this.game.config.width,
      <number>this.game.config.height * 0.8,
      <number>this.game.config.width
    );
    this.physics.add.collider(this.hero.sprite, this.platformHandler);
  }

  update() {
    if (this.hero.sprite.y > this.game.config.height) {
      this.scene.start(SceneKeys.Start, {
        score: this.score,
        titleText: 'you died!',
        buttonText: 'try again',
      });
      this.scene.stop(SceneKeys.Runner);
    } else {
      this.timer = Math.floor((this.time.now - this.startTime) / 1000);
      this.score = this.timer + this.bonus;
      this.scoreText = `Score: ${this.score}`;
      this.scoreBoard.setText(this.scoreText);
      this.platformHandler.update(this.timer);
      this.hero.handleAnimation();
    }
  }
}
