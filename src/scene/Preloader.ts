const hero_run_url = require("../../static/hero_run.png");
const hero_jump_url = require("../../static/hero_jump.png");

import { TextureKeys, SceneKeys } from "../enums";
import { demoTextures } from "../texture/demo";
import { platformTextures } from "../texture/platform";

export class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    const pixelSize = 3;
    const palette = Phaser.Create.Palettes.ARNE16;
    this.textures.generate(TextureKeys.Chick, {
      data: demoTextures.chick,
      pixelWidth: pixelSize,
      palette: palette,
    });
    this.textures.generate(TextureKeys.Bird, {
      data: demoTextures.bird,
      pixelWidth: pixelSize,
      palette: palette,
    });
    this.textures.generate(TextureKeys.Cat, {
      data: demoTextures.cat,
      pixelWidth: pixelSize,
      palette: palette,
    });
    this.textures.generate(TextureKeys.Platform, {
      data: platformTextures.rainbow,
      pixelWidth: pixelSize,
      palette: palette,
    });

    this.load.spritesheet({
      key: "hero_run",
      url: hero_run_url,
      frameConfig: {
        frameWidth: 32,
      }});
    
      this.load.spritesheet({
        key: "hero_jump",
        url: hero_jump_url,
        frameConfig: {
          frameWidth: 32,
        }});
  }

  create() {
    this.scene.start(SceneKeys.Start, {
      titleText: "don't fall down!",
      buttonText: "start",
    });
  }
}
