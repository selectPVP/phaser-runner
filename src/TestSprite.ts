export class TestSprite extends Phaser.Physics.Arcade.Sprite {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, x: number, y: number, texture = "hero_run") {
    super(scene, x, y, texture);
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    
    this.sprite.anims.create({
        key: 'run',
        frames: this.sprite.anims.generateFrameNumbers("hero_run", {}),
        frameRate: 20,
        repeat: -1
    });
    this.sprite.play("run");
  }
}
