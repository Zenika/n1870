import { Body, Events } from 'matter'
import GraphicHelper from '../utils/GraphiHelper'
import Flashlight from './flashlight'

export enum Movement {
  Stopped,
  Forward,
  Backward
}

export enum Ballast {
  Keep,
  Empty,
  Fill,
}

const INIT_SUBMARINE_XPOS = 300

export default class Submarine extends Phaser.Physics.Matter.Sprite {
  light: Flashlight

  movement: Movement

  moving: boolean

  emitter: Phaser.GameObjects.Particles.ParticleEmitter

  flashing: boolean

  constructor(scene: Phaser.Scene, x, y) {
    super(scene.matter.world, x, y, 'submarine')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setPosition(INIT_SUBMARINE_XPOS, 350)

    scene.textures.addSpriteSheetFromAtlas('sub-sheet', { atlas: 'submarine', frame: 'sub', frameWidth: 128 })
    let frames = this.anims.generateFrameNames('sub-sheet', { start: 0, end: 9 })

    this.anims.create({
      key: 'sub-anim-forward',
      frames: frames,
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: 'sub-anim-backward',
      frames: frames.reverse(),
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: 'sub-anim-stopped',
      frames: frames.slice(0),
      frameRate: 10,
      repeat: 0
    })

    this.setDepth(5)

    this.movement = Movement.Stopped
    this.play('sub-anim-stopped')

    this.light = new Flashlight(scene, this)

    let particles = scene.add.particles('bubble')

    particles.setDepth(5)

    this.emitter = particles.createEmitter({
      blendMode: Phaser.BlendModes.NORMAL,
      quantity: 3,
      speed: 20,
      frequency: 300,
      angle: { min: 220, max: 270 },
      scale: { start: 0, end: 0.02 },
      lifespan: { random: [1000, 4000] },
      gravityY: -10,
      active: true,
      alpha: 1
    })

    var shapes = scene.cache.json.get('submarine-box')

    this.setBody(shapes.submarine)

    this.setFixedRotation()
    this.setVelocityX(0)

    this.moving = false
    this.flashing = false

  }

  startFlash() {

    if (!this.flashing) {
      this.flashing = true

      GraphicHelper.flashElement(this.scene,this,2,'Linear',500,100)
      GraphicHelper.flashElement(this.scene,this.light.armLight,2,'Linear',500,100)
    
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.endFlash()
        },
        loop: false
      })

    }

  }

  endFlash() {
    this.flashing = false
  }

  update(newMovement: Movement) {


    this.light.update()
    this.emitter.setPosition(this.getTopLeft().x, this.getTopLeft().y + this.height / 2)

    switch (newMovement) {
      case Movement.Stopped:
        if (newMovement != this.movement) {
          this.movement = newMovement
        }
        this.play('sub-anim-stopped')
        this.emitter.frequency = 300
        break
      case Movement.Forward:
        if (newMovement != this.movement) {
          this.movement = newMovement
        }
        if (this.moving) {
          this.emitter.frequency = 20
          this.play('sub-anim-forward', true)
        } else {
          this.play('sub-anim-stopped')
          this.emitter.frequency = 300
        }
        break
      case Movement.Backward:
        if (newMovement != this.movement) {
          this.movement = newMovement
        }
        if (this.moving) {
          this.play('sub-anim-backward', true)
          this.emitter.frequency = 20
        } else {
          this.play('sub-anim-stopped')
          this.emitter.frequency = 300
        }
        break
      default:
        break
    }

  }
}
