import { TextureKeys, SceneKeys } from "../enums";

interface StartData {
  score?: number;
  titleText?: string;
  buttonText?: string;
}

export class Start extends Phaser.Scene {
  startData: StartData;
  previousScore: number | undefined;
  textSize: number;
  titleText: string;
  buttonText: string;
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

    this.title = this.add.text(
      0,
      <number>this.game.config.height / 4,
      this.previousScore ? scoreText : this.titleText,
      {
        color: "#ff00ff",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );
    this.button = this.add.text(
      0,
      <number>this.game.config.height / 2,
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
      (<number>this.game.config.height / 4) * 3,
      "tap or click to jump",
      {
        color: "#0f0",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: <number>this.game.config.width,
      }
    );
  }
}
