import { TextureKeys } from "./enums";

interface Range {
  min: number;
  max: number;
}

export class PlatformHandler extends Phaser.GameObjects.Group {
  flyingRugGroup: Phaser.Physics.Arcade.Group;
  lastRugSpawnTime: number = 0;

  startSpeed: number = 200;
  currentSpeed: number;
  texture = TextureKeys.Platform;
  heroSpriteHeight: number;
  heroJumpHeight: number;
  heroJumpTime: number;
  heroJumpTravel: number;

  platformWidthRange: Range = { min: 50, max: 250 };
  platformXDistanceRange: Range = { min: 20, max: 120 };
  platformYPositionRange: Range;

  nextPlatformXDistance: number;
  nextPlatformYPosition: number;
  prevPlatformYPosition: number;

  constructor(
    scene: Phaser.Scene,
    heroSpriteHeight: number,
    heroJumpHeight: number,
    heroJumpTime: number
  ) {
    super(scene);

    this.flyingRugGroup = this.scene.physics.add.group({
      immovable: true,
      allowGravity: false,
    });

    this.currentSpeed = this.startSpeed;
    this.heroSpriteHeight = heroSpriteHeight;
    this.heroJumpHeight = heroJumpHeight;
    this.heroJumpTime = heroJumpTime;
    this.heroJumpTravel = this.currentSpeed * this.heroJumpTime;

    this.platformYPositionRange = {
      min: this.heroSpriteHeight * 2,
      max: <number>this.scene.game.config.height - 50,
    };

    this.nextPlatformYPosition = this.platformYPositionRange.max;
  }

  calculatePlatformYPosition() {
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
      return this.calculatePlatformYPosition();
    }

    return yDownOk ? yDown : yUp;
  }

  spawn(x: number, y: number, width: number) {
    const platformSprite = this.scene.physics.add.sprite(x, y, this.texture);
    platformSprite.setImmovable(true);
    platformSprite.setVelocityX(-this.currentSpeed);
    platformSprite.setFrictionX(0);
    platformSprite.displayWidth = width;
    this.add(platformSprite);

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

    this.nextPlatformYPosition = yUpOk ? yUp : yDown;
  }

  update(timer: number) {
    let updateSpeed = false;

    if (!(timer % 10)) {
      const speed = this.startSpeed + timer;
      if (this.currentSpeed !== speed) {
        this.currentSpeed = speed;
        updateSpeed = true;
      }
    }

    let minDistance = <number>this.scene.game.config.width;
    this.heroJumpTravel = this.currentSpeed * this.heroJumpTime;

    this.getChildren().forEach(
      (sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
        if (sprite.x < -sprite.displayWidth) {
          this.killAndHide(sprite);
          this.remove(sprite);
        } else if (updateSpeed) {
          sprite.setVelocityX(-this.currentSpeed);
        }

        const platformDistance =
          <number>this.scene.game.config.width -
          sprite.x -
          sprite.displayWidth / 2;
        minDistance = Math.min(minDistance, platformDistance);
      }
    );

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

      // Flying rug logic
      if (timer - this.lastRugSpawnTime > 5) {
        if (Phaser.Math.Between(0, 100) < 30) {
          this.spawnFlyingRug();
          this.lastRugSpawnTime = timer;
        }
      }
    }
  }

  spawnFlyingRug() {
    const x = <number>this.scene.game.config.width + 80;
    const y = Phaser.Math.Between(150, 300);

    const rug = this.scene.physics.add.image(x, y, "rug");
    rug.setImmovable(true);
    rug.setVelocityX(-this.currentSpeed * 1.1);
    rug.setDisplaySize(48, 24);
    rug.setName("flying_rug");

    this.flyingRugGroup.add(rug);
  }
}
