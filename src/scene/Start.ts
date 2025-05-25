import { TextureKeys, SceneKeys } from "../enums";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

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
  title!: Phaser.GameObjects.Text;
  button!: Phaser.GameObjects.Text;
  hint!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.Start);
  }

  async create() {
    this.textSize = Math.max(16, Math.round((this.game.config.width as number) / 20));

    this.startData = this.scene.settings.data;
    this.previousScore = this.startData?.score ?? 0;
    this.titleText = this.startData?.titleText || "wtf";
    this.buttonText = this.startData?.buttonText || "go";

    const scoreText = `you scored ${this.previousScore}!`;

    const logo = this.add.image(
      this.game.config.width as number * 0.5,
      this.game.config.height as number * 0.2,
      "logo"
    );
    logo.setDisplaySize(300, 156);

    // Main title
    this.title = this.add.text(
      0,
      this.game.config.height as number * 0.4,
      this.previousScore ? scoreText : this.titleText,
      {
        color: "#ff00ff",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: this.game.config.width as number,
      }
    );

    // Wallet / tag display
    this.add.text(
      0,
      this.game.config.height as number * 0.5,
      "",
      {
        color: "#00ffff",
        align: "center",
        fontSize: `${this.textSize * 0.75}px`,
        fixedWidth: this.game.config.width as number,
      }
    );

    // // 🏆 High Score from Firestore
    // const topScore = await this.getFirestoreHighScore();
    // this.add.text(
    //   20,
    //   20,
    //   `🏆 High Score: ${topScore}`,
    //   {
    //     fontSize: `${this.textSize * 0.7}px`,
    //     color: "#ffcc00",
    //   }
    // );

    // 🏁 Leaderboard from scores collection
    // const leaderboard = await this.loadLeaderboard();
    // this.add.text(20, 50, "Top 5 Players:", {
    //   fontSize: `${this.textSize * 0.7}px`,
    //   color: "#ffffff",
    // });
    // leaderboard.forEach((entry, i) => {
    //   this.add.text(
    //     20,
    //     70 + i * 18,
    //     `${i + 1}. ${entry.name} — ${entry.score}`,
    //     {
    //       fontSize: `${this.textSize * 0.6}px`,
    //       color: "#aaaaff",
    //     }
    //   );
    // });

    // Button to start
    this.button = this.add.text(
      0,
      this.game.config.height as number * 0.83,
      this.buttonText,
      {
        color: "#fff",
        align: "center",
        fontSize: `${this.textSize}px`,
        fixedWidth: this.game.config.width as number,
      }
    );
    this.button.setInteractive().on("pointerdown", () =>
      this.scene.start(SceneKeys.Runner, {
        time: this.time.now,
      })
    );

    // Control hint
    this.hint = this.add.text(
      0,
      this.game.config.height as number * 0.9,
      "tap or click to jump",
      {
        color: "#0f0",
        align: "center",
        fontSize: `${this.textSize * 0.75}px`,
        fixedWidth: this.game.config.width as number,
      }
    );
  }

  // Firebase leaderboard (from "scores" collection)
  async loadLeaderboard(): Promise<{ name: string; score: number }[]> {
    try {
      const q = query(
        collection(db, "scores"),
        orderBy("score", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data()) as any;
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      return [];
    }
  }

  // Firestore top score
  async getFirestoreHighScore(): Promise<number> {
    try {
      const docRef = doc(db, "highscore", "PEPERUN");
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().HIGHSCORE : 0;
    } catch (err) {
      console.error("Error fetching highscore:", err);
      return 0;
    }
  }

  // Update global top score (not currently used)
  async setFirestoreHighScore(score: number) {
    try {
      const ref = doc(db, "highscore", "PEPERUN");
      await setDoc(ref, { HIGHSCORE: score });
    } catch (err) {
      console.error("Failed to update Firestore high score:", err);
    }
  }
}
