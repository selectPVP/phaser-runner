import { TextureKeys, SceneKeys } from "../enums";

interface StartData {
  score?: number;
  titleText?: string;
  buttonText?: string;
}

export class Start extends Phaser.Scene {
  startData?: StartData;
  previousScore: number | undefined;
  textSize: number = 16;
  titleText: string = "wtf";
  buttonText: string = "go";
  title: Phaser.GameObjects.Text;
  button: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Start);
  }

  create() {
    this.textSize = Math.max(
      16,
      Math.round(<number>this.game.config.width / 20)
    );

    this.startData = this.scene.settings.data;
    this.previousScore = this.startData?.score;
    this.titleText = this.startData?.titleText || "wtf";
    this.buttonText = this.startData?.buttonText || "go";

    const scoreText: string = `you scored ${this.previousScore}!`;
    const highScore = parseInt(localStorage.getItem("highScore") ?? "0") || 0;

    if (this.previousScore && this.previousScore > highScore) {
      this.add.text(
        0,
        <number>this.game.config.height * 0.45,
        "new high score!",
        {
          color: "#ff0",
          align: "center",
          fontSize: `${this.textSize * 0.75}px`,
          fixedWidth: <number>this.game.config.width,
        }
      );
      localStorage.setItem("highScore", this.previousScore.toString());
    }

    const logo = this.add.image(
      <number>this.game.config.width * 0.5,
      <number>this.game.config.height * 0.2,
      "logo"
    );
    logo.setDisplaySize(300, 156);

    this.title = this.add.text(
      0,
      <number>this.game.config.height * 0.4,
      this.previousScore ? scoreText : this.titleText,
      {
        color: "#ff00ff",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );

    // ✅ NEW TEXT BLOCK
    this.add.text(
      0,
      <number>this.game.config.height * 0.5,
      "NejaftZqreBfLaQbAEtPxr5wp7ZqRNNSBRR1hUjpump",
      {
        color: "#00ffff",
        align: "center",
        fontSize: `${this.textSize * 0.75}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );

    this.button = this.add.text(
      0,
      <number>this.game.config.height * 0.65,
      this.buttonText,
      {
        color: "#fff",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );
    this.button.setInteractive().on("pointerdown", () =>
      this.scene.start(SceneKeys.Runner, {
        time: this.time.now,
      })
    );

    this.hint = this.add.text(
      0,
      <number>this.game.config.height * 0.9,
      "tap or click to jump",
      {
        color: "#0f0",
        align: "center",
        fontSize: `${this.textSize * 0.75}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );
  }
}
