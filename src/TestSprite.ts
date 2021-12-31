export class TestSprite extends Phaser.Physics.Arcade.Sprite {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  
    constructor(
      scene: Phaser.Scene,
      x: number,
      y: number,
      texture = "hero_run"
    ) {
      super(scene, x, y, texture);
      this.sprite = this.scene.physics.add.sprite(x, y, texture);
    }
  }