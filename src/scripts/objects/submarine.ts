export default class Submarine extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'submarine')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setDepth(3)

    this.setMaxVelocity(200)
    this.play('sub-anim')

    //To decelerate
    this.setDragX(0.05)
    this.setDragY(0.05)

    this.setDamping(true)

    this.setCollideWorldBounds(true)

    
  }

}
