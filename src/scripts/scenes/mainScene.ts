import Submarine, { Ballast, Movement, SUBMARINE_SPEED_STEP } from '../objects/submarine'
import Background from '../objects/background'
import Enemy, { EnemyType } from '../objects/enemy'


export const NB_BACKGROUND = 10
export const INIT_TIME = 90

export default class MainScene extends Phaser.Scene {
  submarine: Submarine
  background: Background
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ennemis: Enemy[]
  score: number = 0
  scoreText: Phaser.GameObjects.Text
  _time: number = 0
  currentMovement: Movement = Movement.Forward
  ballaste: Ballast = Ballast.Keep

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
          this.scene.start('GameOverScene', { score: this.getScoreToDisplay() })
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
      .text(100, 50, `Time: ${this._time} Score: ${this.getScoreToDisplay()}`, {
        color: '#ffffff',
        fontSize: '24px',
        align: 'center',
        fixedWidth: 400,
      })
      .setDepth(6)

    this.ennemis = this.generateRandomEnemies()

    this.matter.world.on('collisionstart', (event, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
      if (this.checkCollision(bodyA, bodyB, 'submarine-light', 'enemy') && this.submarine.light.currentBody.render.visible) {
        this.getGameObjectCollision(bodyA, bodyB, 'enemy').escape()
      } else if (this.checkCollision(bodyA, bodyB, 'submarine', 'enemy')) {
        this.onCollision(this.getGameObjectCollision(bodyA, bodyB, 'enemy'))
      } else if (this.checkCollision(bodyA, bodyB, 'submarine', 'background')) {
        if (this.score > 10) {
          this.score -= 10
        }
        this.submarine.moving = false
        //this.currentMovement = Movement.Stopped
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

  onCollision(enemy: Enemy) {
    if (!this.submarine.flashing) {
      this.submarine.moving = false
      this.submarine.setVelocityX(0)
      if (this.score > 50) {
        this.score -= 50
      }
      this.submarine.startFlash()

      enemy.killhim()
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
      case Phaser.Input.Keyboard.KeyCodes.R:
        if (this._time < INIT_TIME) {
          this.scene.start('GameOverScene', { score: 0 })
        }
        break
      default:
        break
    }
    event.preventDefault()
  }

  getScoreToDisplay(): number {
    return Math.floor(this.score)
  }

  update() {
    if (this._time <= 10) {
      this.scoreText.setColor('#ff0000')
    }
    this.scoreText.setText(`Time: ${this._time} Score: ${this.getScoreToDisplay()}`)


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
          this.score += this.submarine.x - this.lastScorePos
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
          new Enemy(this, this.scale.width * i, randomYPosition, randomEnemyType, this.submarine)
        )
      
    }
    return enemies
  }

  checkCollision(bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType, label1: String, label2: String) {
    return (bodyA.label === label1 && bodyB.label === label2) || (bodyB.label === label1 && bodyA.label === label2)
  }

  getGameObjectCollision(bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType, label: String) {
    if (bodyA.label === label) {
      return bodyA.gameObject
    } else if (bodyB.label === label) {
      return bodyB.gameObject
    }
    return null;
  }

  
  removeEnemy(enemy:Enemy): void {

    const index: number = this.ennemis.indexOf(enemy, 0);
    if (index > -1) {
      this.ennemis.splice(index, 1);
    }
     
  }


}
