import { TextureKeys, SceneKeys } from "../enums";
import { platformTextures } from "../texture/platform";


import url_sprite_pepe_run from "/static/pepe_run.png";
import url_sprite_pepe_jump from "/static/pepe_jump.png";
import url_sprite_pepe_jump_2 from "/static/pepe_jump_2.png";
import url_logo from "/static/logo.png";
import url_bg from "/static/rgrush.png";

export class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    const pixelSize = 3;
    const palette = Phaser.Create.Palettes.ARNE16;
    this.textures.generate(TextureKeys.Platform, {
      data: platformTextures.rainbow,
      pixelWidth: pixelSize,
      palette: palette,
    });

    this.load.image("logo", url_logo);
    this.load.image("background", url_bg);

    this.load.spritesheet({
      key: "pepe_jump_2",
      url: url_sprite_pepe_jump_2,
      frameConfig: {
        frameWidth: 32,
      },
    });
    this.load.spritesheet({
      key: "pepe_jump",
      url: url_sprite_pepe_jump,
      frameConfig: {
        frameWidth: 32,
      },
    });
    this.load.spritesheet({
      key: "pepe_run",
      url: url_sprite_pepe_run,
      frameConfig: {
        frameWidth: 32,
        startFrame: 0,
        endFrame: -1,
      },
    });
  }

  create() {
    this.scene.start(SceneKeys.Start, {
      titleText: "don't fall down!",
      buttonText: "start",
    });
  }
}
