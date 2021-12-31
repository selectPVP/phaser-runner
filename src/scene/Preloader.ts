import { TextureKeys, SceneKeys } from '../enums';
import { demoTextures } from '../texture/demo';
import { platformTextures } from '../texture/platform';

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
  }

  create() {
    this.scene.start(SceneKeys.Start, {
      titleText: "don't fall down!",
      buttonText: 'start',
    });
  }
}
