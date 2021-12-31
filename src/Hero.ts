import { TextureKeys } from "./enums";

export class Hero extends Phaser.Physics.Arcade.Sprite {
  gravity: number = 800;
  jumpForce: number = 500;
  jumpsAllowed: number = 2;
  jumpsUsed: number = 0;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = "hero_run"
  ) {
    super(scene, x, y, texture);
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
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
  }

  jump() {
    if (
      this.sprite.body.touching.down ||
      (this.jumpsUsed > 0 && this.jumpsUsed < this.jumpsAllowed)
    ) {
      if (this.sprite.body.touching.down) {
        this.jumpsUsed = 0;
      }
      this.sprite.setVelocityY(this.jumpForce * -1);
      this.jumpsUsed++;
    }
  }

  handleAnimation() {
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
