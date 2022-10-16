import Submarine, { Ballast, Movement, SUBMARINE_SPEED_STEP } from '../objects/submarine'
import Background from '../objects/background'
import Enemy, { EnemyType } from '../objects/enemy'
import Bullet from '../objects/bullet'


export const NB_BACKGROUND = 10
export const INIT_TIME = 200

export default class MainScene extends Phaser.Scene {
  fpsText
  submarine: Submarine
  background: Background
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ennemis: Enemy[]
  score: number = 0
  scoreText: Phaser.GameObjects.Text
  _time: number = 0
  currentMovement: Movement = Movement.Stopped
  ballaste: Ballast = Ballast.Keep
  bullet: Bullet

  lastScorePos: number = 0

  constructor() {
    super({
      key: 'MainScene',
      physics: {
        default: 'matter',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        },
        matter: {
          debug: false,
          gravity: {
            y: 0
          }
        }
      }
    })
  }

  init() {
    this.score = 0
    this.lastScorePos = 0
    this._time = INIT_TIME
  }

  create() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this._time--
        if (!this._time) {
          this.scene.start('GameOverScene', { score: this.score })
        }
      },
      loop: true
    })
    const { width, height } = this.scale

    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0)

    this.cameras.main.startFollow(this.submarine)
    this.cameras.main.setLerp(1, 0)
    this.cameras.main.setBounds(0, 0, 2400 * NB_BACKGROUND, height)

    this.background = new Background(this)

    this.scoreText = this.add
      .text(100, 50, `Time: ${this._time} Score: ${this.score}`, {
        color: '#ffffff',
        fontSize: '24px',
        align: 'center',
        fixedWidth: 400,
      })
      .setDepth(6)

    this.ennemis = this.generateRandomEnemies()
    this.bullet = new Bullet(this)

    this.matter.world.on('collisionstart', (event, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
      if (
        bodyA.label === 'submarine-light' &&
        bodyB.label === 'enemy' &&
        this.submarine.light.currentBody.render.visible
      ) {
        bodyB.gameObject.escape()
      } else if (
        bodyB.label === 'submarine-light' &&
        bodyA.label === 'enemy' &&
        this.submarine.light.currentBody.render.visible
      ) {
        bodyA.gameObject.escape()
      } else if (bodyA.label === 'submarine' && bodyB.label === 'enemy') {
        this.onCollision()
      } else if (bodyB.label === 'submarine' && bodyA.label === 'enemy') {
        this.onCollision()
      } else if ((bodyB.label === 'bullet' && bodyA.label === 'ennemy') 
      || (bodyA.label === 'bullet' && bodyB.label === 'ennemy')) {
        this.score += 500
        bodyA.gameObject.explode()
        bodyB.gameObject.explode()
      }
    })

    this.matter.world.setBounds(0, 0, 2400 * NB_BACKGROUND, 600, 64, true, true, true, true)
    this.physics.world.setBounds(0, 0, width, 600, true, true, true, true)
    this.lights.enable().setAmbientColor(0x555555)

    this.input.keyboard.on('keydown', event => this.dealWithKeyDown(event))
    this.input.keyboard.on('keyup', event => this.resetCommand(event))

    this.scoreText.setScrollFactor(0)

    this.lastScorePos = this.submarine.x
  }

  onCollision() {
    if (!this.submarine.flashing) {
      this.submarine.moving = false
      this.submarine.setVelocityX(0)
      if (this.score > 50) {
        this.score -= 50
      }
      this.submarine.startFlash()
    }
  }

  dealWithKeyDown(event) {
    switch (event.which) {
      case Phaser.Input.Keyboard.KeyCodes.ONE:
      case Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE:
        this.submarine.light.lightDown()
        break
      case Phaser.Input.Keyboard.KeyCodes.TWO:     
      case Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO:
        this.submarine.light.lightStraight()
        break
      case Phaser.Input.Keyboard.KeyCodes.THREE:
      case Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE:
          this.submarine.light.lightUp()
          break;
      case Phaser.Input.Keyboard.KeyCodes.L:
        this.submarine.light.toggleLight()
        break
      case Phaser.Input.Keyboard.KeyCodes.LEFT:
        this.currentMovement = Movement.Backward
        break
      case Phaser.Input.Keyboard.KeyCodes.RIGHT:
        this.currentMovement = Movement.Forward
        break
      case Phaser.Input.Keyboard.KeyCodes.UP:
        this.ballaste = Ballast.Fill
        break
      case Phaser.Input.Keyboard.KeyCodes.DOWN:
        this.ballaste = Ballast.Empty
        break
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
        this.submarine.moving = true
        break
      case Phaser.Input.Keyboard.KeyCodes.P:
        if (this._time < INIT_TIME) {
          this.scene.start('GameOverScene', { score: 0 })
        }
        break
      case Phaser.Input.Keyboard.KeyCodes.T:
        if (!this.bullet.active && !this.submarine.flashing) {
          this.bullet.fire(this.submarine.x, this.submarine.y)
        }
        break
      default:
        break
    }
    event.preventDefault()
  }

  update(time: number, delta: number) {
    this.scoreText.setText(`Time: ${this._time} Score: ${this.score}`)


    if (this.ballaste === Ballast.Fill) {
      this.submarine.setVelocityY(SUBMARINE_SPEED_STEP)
    } else if (this.ballaste === Ballast.Empty) {
      this.submarine.setVelocityY(-SUBMARINE_SPEED_STEP)
    } else {
      this.submarine.setVelocityY(0)
    }

    if (this.submarine.moving) {
      if (this.currentMovement === Movement.Forward) {
        this.submarine.setVelocityX(SUBMARINE_SPEED_STEP)

        if (this.submarine.x > this.lastScorePos) {
          this.score += Math.floor(this.submarine.x - this.lastScorePos)
          this.lastScorePos = this.submarine.x
        }
      } else if (this.currentMovement === Movement.Backward) {
        this.submarine.setVelocityX(-SUBMARINE_SPEED_STEP)
      }
    }

    this.background.update()
    this.submarine.update(this.currentMovement)

    this.ennemis.forEach(ennemi => {
      ennemi.update()
    })
    if (this.bullet.active) {
      this.bullet.update(time, delta)
    }
  }

  resetCommand(event) {
    switch (event.which) {
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
        this.submarine.moving = false
        break
      case Phaser.Input.Keyboard.KeyCodes.UP:
        this.ballaste = Ballast.Keep
        break
      case Phaser.Input.Keyboard.KeyCodes.DOWN:
        this.ballaste = Ballast.Keep
        break
      default:
        break
    }
  }

  generateRandomEnemies(): Array<Enemy> {
    const MAX_SCALE = 75
    const SPAWNING_FREQUENCY = 1
    const MIN_Y_POSITION = 150
    const MAX_Y_POSITION = this.scale.height - 150

    const enemies: Array<Enemy> = []
    let randomYPosition = 0
    for (let i = 2; i < MAX_SCALE; i+=SPAWNING_FREQUENCY) {
        const randomEnemyType: EnemyType = Enemy.getRandomEnemyType()
        randomYPosition = Math.floor(Math.random() * (MAX_Y_POSITION - MIN_Y_POSITION) + MIN_Y_POSITION)
        enemies.push(
          new Enemy(this, this.scale.width * i, randomYPosition, randomEnemyType, this.submarine, this.onCollision.bind(this))
        )
      
    }
    return enemies
  }
}
