export default class Submarine extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'submarine')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.cameras.main.startFollow(this)

    this.setDepth(2);

    this.setMaxVelocity(200)
    this.play('sub-anim')
    this.setCollideWorldBounds(true)

    //To decelerate
    this.setDragX(0.05)
    this.setDragY(0.05)

    this.setDamping(true);
  }

}
