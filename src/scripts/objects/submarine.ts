export default class Submarine extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'submarine')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.cameras.main.startFollow(this)

    this.setDepth(2);

    this.setDrag(300);
    this.setAngularDrag(400);
    this.setMaxVelocity(600);
  }
}
