import { TextureKeys } from './enums';

export class Platform extends Phaser.Physics.Arcade.Sprite {
  startSpeed: number = 350;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    width: number
  ) {
    super(scene, x, y, texture);
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    this.sprite.setImmovable(true);
    this.sprite.setVelocityX(this.startSpeed * -1);
    this.sprite.setFrictionX(0);
    this.sprite.displayWidth = width;
  }
}

interface Range {
  min: number;
  max: number;
}

export class PlatformHandler extends Phaser.GameObjects.Group {
  texture = TextureKeys.Platform;
  platformWidthRange: Range = {
    min: 50,
    max: 250,
  };
  platformXDistanceRange: Range = {
    min: 50,
    max: 200,
  };
  platformYRange: Range = {
    min: 80,
    max: 200,
  };

  nextPlatformXDistance: number;
  platformYPositionBuffer: number;
  platformYPositionMax: number;
  platformYPositionMin: number;
  nextPlatformYPosition: number;

  constructor(scene: Phaser.Scene, minDistance: number) {
    super(scene);
    this.platformYPositionBuffer = <number>this.scene.game.config.height * 0.2;
    this.platformYPositionMin = this.platformYPositionBuffer;
    this.platformYPositionMax = <number>this.scene.game.config.height - this.platformYPositionBuffer;
    this.nextPlatformYPosition = this.platformYPositionMax;
  }

  spawn(x: number, y: number, width: number) {
    const platform = new Platform(this.scene, x, y, this.texture, width);
    this.add(platform.sprite);
    this.nextPlatformXDistance = Phaser.Math.Between(
      this.platformXDistanceRange.min,
      this.platformXDistanceRange.max
    );
    const currentPlatformY = this.nextPlatformYPosition;
    const nextPlatformYDistance = Phaser.Math.Between(
      this.platformYRange.min,
      this.platformYRange.max
    );
    const yUp = currentPlatformY - nextPlatformYDistance;
    const yDown = currentPlatformY + nextPlatformYDistance;
    const yUpOk = yUp >= this.platformYPositionMin;
    const yDownOk = yUp <= this.platformYPositionMax;
    const nextPlatformYPosition = yUpOk ? yUp : yDown;
    console.log("platform", {
      currentPlatformY: currentPlatformY,
      nextPlatformYDistance: nextPlatformYDistance,
      yUp: yUp,
      yDown: yDown,
      yUpOk: yUpOk,
      yDownOk: yDownOk,
      nextPlatformYPosition: nextPlatformYPosition
    });
    this.nextPlatformYPosition = nextPlatformYPosition;
  }

  cleanUp(minDistance: number) {
    this.getChildren().forEach(function (
      sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    ) {
      let platformDistance =
        this.scene.game.config.width - sprite.x - sprite.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (sprite.x < -sprite.displayWidth) {
        this.killAndHide(sprite);
        this.remove(sprite);
      }
    },
    this);

    if (minDistance > this.nextPlatformXDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        this.platformWidthRange.min,
        this.platformWidthRange.max
      );
      this.spawn(
        <number>this.scene.game.config.width + nextPlatformWidth / 2,
        this.nextPlatformYPosition,
        nextPlatformWidth
      );
    }
  }
}
