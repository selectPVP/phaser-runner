import { TextureKeys } from "./enums";

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
  prevPlatformYPosition: number;

  // there's still something not quite right about how y positions are determined
  constructor(
    scene: Phaser.Scene,
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
      max: <number>this.scene.game.config.height - 50,
    };
    this.nextPlatformYPosition = this.platformYPositionRange.max;
  }

  calculatePlatformYPosition() {
    // TODO: make sure this.prevPlatformYPosition is set before method is called
    const nextPlatformYDistance = Phaser.Math.Between(
      this.heroSpriteHeight * 2,
      this.heroJumpHeight * 1.5
    );
    const yUp = this.prevPlatformYPosition - nextPlatformYDistance;
    const yDown = this.prevPlatformYPosition + nextPlatformYDistance;
    const yUpOk = yUp >= this.platformYPositionRange.min;
    const yDownOk = yDown <= this.platformYPositionRange.max;
    if (!yUpOk && !yDownOk) {
      console.log("calculate again");
      this.calculatePlatformYPosition();
    } else {
      return yDownOk ? yDown : yUp;
    }
  }

  spawn(x: number, y: number, width: number) {
    const platformSprite = this.scene.physics.add.sprite(x, y, this.texture);
    platformSprite.setImmovable(true);
    platformSprite.setVelocityX(-this.currentSpeed);
    platformSprite.setFrictionX(0);
    platformSprite.displayWidth = width;
    this.add(platformSprite);
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
    const yDownOk = yDown <= this.platformYPositionRange.max;
    // doesn't check downOk and it should
    // move the position calculation logic out into another method
    // and use prevPlatformYPosition instead of nextPlatformYPosition
    // then we can get a new number if !upOk && !downOk
    const nextPlatformYPosition = yUpOk ? yUp : yDown;

    // new method, not ready yet
    // do this before adding the sprite to get the y position
    // once ready we can remove x from the spawn() call
    // console.log("platformYPosition", this.calculatePlatformYPosition());

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
        xRightEdge: sprite.x + sprite.displayWidth * 2,
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
