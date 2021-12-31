import { TextureKeys } from './enums';

export class Hero extends Phaser.Physics.Arcade.Sprite {
  gravity: number = 900;
  jumpForce: number = 400;
  jumpsAllowed: number = 2;
  jumpsUsed: number = 0;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = TextureKeys.Chick
  ) {
    super(scene, x, y, texture);
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    this.sprite.setGravityY(this.gravity);
    this.scene.input.on('pointerdown', this.jump, this);
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
}
