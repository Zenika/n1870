import Flashlight from './flashlight'

export enum Movement {
  Stopped,
  Forward,
  Backward
}

export default class Submarine extends Phaser.Physics.Arcade.Sprite {
  light: Flashlight

  movement: Movement

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, 'submarine')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    scene.textures.addSpriteSheetFromAtlas('sub-sheet', { atlas: 'all', frame: 'sub', frameWidth: 128 })

    this.anims.create({
      key: 'sub-anim-forward',
      frames: this.anims.generateFrameNumbers('sub-sheet', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'sub-anim-backward',
      frames: this.anims.generateFrameNumbers('sub-sheet', { start: 9, end: 0 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'sub-anim-stopped',
      frames: this.anims.generateFrameNumbers('sub-sheet', { frames: [0] }),
      frameRate: 10,
      repeat: 0
    })

    this.setDepth(3)

    this.setMaxVelocity(200)

    this.movement = Movement.Stopped
    this.play('sub-anim-stopped')

    //To decelerate
    this.setDragX(0.05)
    this.setDragY(0.05)

    this.setDamping(true)

    this.setCollideWorldBounds(true)

    this.light = new Flashlight(scene, this)
  }

  public update(newMovement: Movement) {
    this.light.update()

    if (newMovement != this.movement) {
      this.movement = newMovement
      switch (this.movement) {
        case Movement.Stopped:
          this.play('sub-anim-stopped')
          break
        case Movement.Forward:
          this.play('sub-anim-forward')
          break
        case Movement.Backward:
          this.play('sub-anim-backward')
          break
        default:
          break
      }
    }
  }
}
