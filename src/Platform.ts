import { TextureKeys } from "./enums";

export class Platform extends Phaser.Physics.Arcade.Sprite {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    width: number,
    startSpeed: number
  ) {
    super(scene, x, y, texture);
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    this.sprite.setImmovable(true);
    this.sprite.setVelocityX(-startSpeed);
    this.sprite.setFrictionX(0);
    this.sprite.displayWidth = width;
  }
}

interface Range {
  min: number;
  max: number;
}

export class PlatformHandler extends Phaser.GameObjects.Group {
  startSpeed: number = 200;
  currentSpeed: number;
  texture = TextureKeys.Platform;
  heroSpriteHeight: number;
  heroJumpHeight: number;
  heroJumpTime: number;
  heroJumpTravel: number; // distance a platform travels in hero jump time
  platformWidthRange: Range = {
    min: 50,
    max: 250,
  };
  platformXDistanceRange: Range = {
    min: 20,
    max: 120,
  };
  platformYPositionRange: Range;

  nextPlatformXDistance: number;
  nextPlatformYPosition: number;

  constructor(
    scene: Phaser.Scene,
    // minDistance: number,
    heroSpriteHeight: number,
    heroJumpHeight: number,
    heroJumpTime: number
  ) {
    super(scene);
    this.currentSpeed = this.startSpeed;
    this.heroSpriteHeight = heroSpriteHeight;
    this.heroJumpHeight = heroJumpHeight;
    this.heroJumpTime = heroJumpTime;
    this.heroJumpTravel = this.currentSpeed * this.heroJumpTime;
    this.platformYPositionRange = {
      min: this.heroSpriteHeight * 2,
      // change this to game height - platform height, probably
      max: <number>this.scene.game.config.height * 0.8,
    };
    this.nextPlatformYPosition = this.platformYPositionRange.max;
  }

  spawn(x: number, y: number, width: number) {
    // notes
    //   the longer a player stays in:
    //     + platform x/y distance
    //       (figure out high/low tolerance limits)
    const platform = new Platform(
      this.scene,
      x,
      y,
      this.texture,
      width,
      this.currentSpeed
    );
    this.add(platform.sprite);
    // x distance between platforms should depend on the current speed and the
    // time hero sprite takes to complete a jump (return to initial y position)
    this.nextPlatformXDistance = Phaser.Math.Between(
      this.platformXDistanceRange.min,
      this.platformXDistanceRange.max
    );
    const currentPlatformY = this.nextPlatformYPosition;
    const nextPlatformYDistance = Phaser.Math.Between(
      this.heroSpriteHeight * 2,
      this.heroJumpHeight * 1.5
    );
    const yUp = currentPlatformY - nextPlatformYDistance;
    const yDown = currentPlatformY + nextPlatformYDistance;
    const yUpOk = yUp >= this.platformYPositionRange.min;
    const yDownOk = yUp <= this.platformYPositionRange.max;
    const nextPlatformYPosition = yUpOk ? yUp : yDown;
    // console.log("platform", {
    //   currentPlatformY: currentPlatformY,
    //   nextPlatformYDistance: nextPlatformYDistance,
    //   yUp: yUp,
    //   yDown: yDown,
    //   yUpOk: yUpOk,
    //   yDownOk: yDownOk,
    //   nextPlatformYPosition: nextPlatformYPosition,
    // });
    this.nextPlatformYPosition = nextPlatformYPosition;
  }

  update(timer: number) {
    let updateSpeed: boolean = false;
    if (!(timer % 10)) {
      const speed = this.startSpeed + timer;
      // console.log("speed", speed);
      // console.log("this.currentSpeed", this.currentSpeed);
      if (this.currentSpeed !== speed) {
        this.currentSpeed = speed;
        updateSpeed = true;
      }
    }
    let minDistance: number = <number>this.scene.game.config.width;
    this.heroJumpTravel = this.currentSpeed * this.heroJumpTime;
    this.getChildren().forEach(
      (sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
        if (sprite.x < -sprite.displayWidth) {
          this.killAndHide(sprite);
          this.remove(sprite);
        } else {
          if (updateSpeed) {
            sprite.setVelocityX(-this.currentSpeed);
          }
        }
        let platformDistance =
          <number>this.scene.game.config.width -
          sprite.x -
          sprite.displayWidth / 2;
        minDistance = Math.min(minDistance, platformDistance);
      }
    );
    const platforms = this.getChildren().map(
      (sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => ({
        x: sprite.x,
        displayWidth: sprite.displayWidth,
        xRightEdge: sprite.x + (sprite.displayWidth * 2)
      })
    );
    // why tho
    if (minDistance > this.nextPlatformXDistance) {
      console.log("platforms", platforms);
      // platforms should get shorter over time
      const nextPlatformWidth = Phaser.Math.Between(
        this.platformWidthRange.min,
        this.platformWidthRange.max
      );
      console.log("this.nextPlatformXDistance", this.nextPlatformXDistance);
      this.spawn(
        <number>this.scene.game.config.width + nextPlatformWidth / 2,
        this.nextPlatformYPosition,
        nextPlatformWidth
      );
    }
  }
}
