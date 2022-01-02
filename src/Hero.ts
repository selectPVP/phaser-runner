import { TextureKeys } from "./enums";

export class Hero extends Phaser.Physics.Arcade.Sprite {
  gravity: number;
  jumpForce: number;
  jumpHeight: number; // max pixels above initial y position
  jumpTime: number; // seconds to return to initial y position
  jumpsAllowed: number;
  jumpsUsed: number = 0;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gravity: number,
    jumpForce: number,
    jumpsAllowed: number,
    texture = "hero_run"
  ) {
    super(scene, x, y, texture);
    this.gravity = gravity;
    this.jumpForce = jumpForce;
    this.jumpsAllowed = jumpsAllowed;
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    this.sprite.setDebug(true, true, 255)
    this.sprite.anims.create({
      key: "run",
      frames: this.sprite.anims.generateFrameNumbers("hero_run", {}),
      frameRate: 20,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "jump",
      frames: this.sprite.anims.generateFrameNumbers("hero_jump", {}),
      frameRate: 20,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "jump_double",
      frames: this.sprite.anims.generateFrameNumbers("hero_jump_double", {}),
      frameRate: 20,
      repeat: -1,
    });
    this.sprite.setGravityY(this.gravity);
    this.scene.input.on("pointerdown", this.jump, this);
    this.calculateJumpParameters();
  }

  calculateJumpParameters() {
    const timeToPeak = this.jumpForce / this.gravity;
    this.jumpHeight =
    this.jumpForce * timeToPeak - (this.gravity * Math.pow(timeToPeak, 2)) / 2;
    this.jumpTime = 2 * timeToPeak;
  }

  jump() {
    if (
      this.sprite.body.touching.down ||
      (this.jumpsUsed > 0 && this.jumpsUsed < this.jumpsAllowed)
    ) {
      if (this.sprite.body.touching.down) {
        this.jumpsUsed = 0;
      }
      this.sprite.setVelocityY(0 - this.jumpForce);
      this.jumpsUsed++;
    }
  }

  handleAnimation() {
    if (this.sprite.body.velocity.y < 0) {
      // console.log("this.sprite.y", this.sprite.y);
    }
    if (this.sprite.body.touching.down) {
      this.sprite.play("run", true);
    } else {
      if (this.jumpsUsed > 1 && this.sprite.body.velocity.y < 0) {
        this.sprite.play("jump_double", true);
      } else {
        this.sprite.play("jump", true);
      }
    }
  }
}
