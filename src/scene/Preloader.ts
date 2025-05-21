import { TextureKeys, SceneKeys } from "../enums";
import { platformTextures } from "../texture/platform";


import url_sprite_hero_run from "/static/hero_run.png";
import url_sprite_hero_jump from "/static/hero_jump.png";
import url_sprite_hero_jump_double from "/static/hero_jump_double.png";
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
      key: "hero_jump",
      url: url_sprite_hero_jump,
      frameConfig: {
        frameWidth: 32,
      },
    });
    this.load.spritesheet({
      key: "hero_jump_double",
      url: url_sprite_hero_jump_double,
      frameConfig: {
        frameWidth: 32,
      },
    });
    this.load.spritesheet({
      key: "hero_run",
      url: url_sprite_hero_run,
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
