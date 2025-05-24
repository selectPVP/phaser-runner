import { SceneKeys } from "../enums";
import { Hero } from "../Hero";
import { PlatformHandler } from "../Platform";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export class Runner extends Phaser.Scene {
  startData!: { time?: number };
  startTime!: number;
  timer: number = 0;
  bonus: number = 0;
  score: number = 0;
  scoreText!: string;
  scoreBoard!: Phaser.GameObjects.Text;
  gravity: number = 800;
  jumpForce: number = 500;
  jumpsAllowed: number = 2;
  platformHandler!: PlatformHandler;
  hero!: Hero;
  submitted = false; // prevent multiple submissions

  constructor() {
    super(SceneKeys.Runner);
  }

  create() {
    this.startData = this.scene.settings.data;
    this.startTime = this.startData?.time || this.time.now;

    this.add.image(0, 0, "background")
      .setOrigin(0)
      .setScrollFactor(0)
      .setDisplaySize(this.game.config.width as number, this.game.config.height as number);

    this.scoreText = `Score: ${this.score}`;
    this.scoreBoard = this.add.text(5, 5, this.scoreText, {
      color: "#0f0",
      fontSize: "20px",
    });

    this.hero = new Hero(
      this,
      this.game.config.width as number / 3,
      this.game.config.height as number / 2,
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
      this.game.config.width as number,
      this.game.config.height as number * 0.8,
      this.game.config.width as number
    );

    this.physics.add.collider(
      this.hero.sprite,
      this.platformHandler.getChildren() as Phaser.GameObjects.GameObject[]
    );

    this.physics.add.overlap(
      this.hero.sprite,
      this.platformHandler.flyingRugGroup,
      () => this.gameOver("you touched the cursed rug!")
    );
  }

  update() {
    if (this.hero.sprite.y > (this.game.config.height as number)) {
      this.gameOver("you died!");
    } else {
      this.timer = Math.floor((this.time.now - this.startTime) / 1000);
      this.score = this.timer + this.bonus;
      this.scoreText = `Score: ${this.score}`;
      this.scoreBoard.setText(this.scoreText);

      this.platformHandler.update(this.timer);
      this.hero.handleAnimation();
    }
  }

  async gameOver(message: string) {
    if (this.submitted) return;
    this.submitted = true;

    const name = prompt("You died! Enter your name:");
    if (name) {
      try {
        console.log("Submitting to Firestore:", name, this.score);
        await addDoc(collection(db, "scores"), {
          name,
          score: this.score,
          createdAt: new Date()
        });
        console.log("✅ Score submitted to Firebase!");
      } catch (err) {
        console.error("❌ Failed to submit score:", err);
      }
    }

    this.scene.start(SceneKeys.Start, {
      score: this.score,
      titleText: message,
      buttonText: "try again",
    });

    this.scene.stop(SceneKeys.Runner);
  }
}
