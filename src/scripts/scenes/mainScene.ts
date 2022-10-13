import Submarine, { Ballast, Movement } from '../objects/submarine'
import FpsText from '../objects/fpsText'
import Background from '../objects/background'
import Enemy from '../objects/enemy'


const SUBMARINE_SPEED_STEP = 2
export const NB_BACKGROUND = 10;


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
  ballaste: Ballast = Ballast.Keep;

  lastScorePos: number = 0


  constructor() {
    super({
      key: 'MainScene',
      physics: {
        default: "matter",
        arcade: {
          debug: false,
          gravity: { y: 0 }
        },
        matter: {
          debug: false ,
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
    this._time = 200
  }

  create() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this._time--;
        if (!this._time) {
          this.scene.start('GameOverScene', { score: this.score });
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


    // display the Phaser.VERSION
    this.scoreText = this.add
      .text(0, 0, `Time: ${this._time} Score: ${this.score}`, {
        color: '#ffffff',
        fontSize: '24px'
      })
      .setDepth(6)

    this.ennemis = []
    this.ennemis.push(new Enemy(this, width * 2, 400, 'fish', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 2, 250, 'octopus', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 2.5, 300, 'octopus', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 3, 350, 'octopus', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 3, 400, 'fish', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 4, 350, 'octopus', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 5, 250, 'octopus', this.submarine, this.onCollision.bind(this)))

    this.ennemis.push(new Enemy(this, width, 200, 'shark', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 3, 350, 'shark', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 4, 400, 'shark', this.submarine, this.onCollision.bind(this)))


    this.ennemis.push(new Enemy(this, width * 5, 200, 'fish', this.submarine, this.onCollision.bind(this)))
    this.ennemis.push(new Enemy(this, width * 5, 300, 'fish', this.submarine, this.onCollision.bind(this)))

    this.matter.world.on("collisionstart", (event, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
      if (bodyA.label === "submarine-light" && bodyB.label === "ennemy" && this.submarine.light.currentBody.render.visible) {
        bodyB.gameObject.escape()
      } else if (bodyB.label === "submarine-light" && bodyA.label === "ennemy" && this.submarine.light.currentBody.render.visible) {
        bodyA.gameObject.escape()
      } else if (bodyA.label === "submarine" && bodyB.label === "ennemy") {
        this.onCollision()
      } else if (bodyB.label === "submarine" && bodyA.label === "ennemy") {
        this.onCollision()
      }
    });


    // this.fpsText = new FpsText(this)

    // this.fpsText.setPosition(0, 80).setDepth(7)

    this.matter.world.setBounds(0, 0, 2400 * NB_BACKGROUND, 600, 64, true, true, true, true)
    this.physics.world.setBounds(0, 0, width, 600, true, true, true, true)
    this.lights.enable().setAmbientColor(0x555555)

    this.input.keyboard.on('keydown', event => this.dealWithKeyDown(event))
    this.input.keyboard.on('keyup', event => this.resetCommand(event))

    this.scoreText.setScrollFactor(0)
    //this.fpsText.setScrollFactor(0)

    this.lastScorePos = this.submarine.x
  }

  onCollision() {
    if(!this.submarine.flashing) {
      this.submarine.moving = false
      this.submarine.setVelocityX(0)
      this.score -= 50;
      this.submarine.startFlash()
    }
  }


  dealWithKeyDown(event) {

    switch (event.which) {
      case Phaser.Input.Keyboard.KeyCodes.ONE:
        this.submarine.light.lightDown()
        break;
      case Phaser.Input.Keyboard.KeyCodes.TWO:
        this.submarine.light.lightStraight()
        break;
      case Phaser.Input.Keyboard.KeyCodes.THREE:
        this.submarine.light.lightUp()
        break;
      case Phaser.Input.Keyboard.KeyCodes.L:
        this.submarine.light.toggleLight()
        break;
      case Phaser.Input.Keyboard.KeyCodes.LEFT:
        this.currentMovement = Movement.Backward
        break;
      case Phaser.Input.Keyboard.KeyCodes.RIGHT:
        this.currentMovement = Movement.Forward
        break;
      case Phaser.Input.Keyboard.KeyCodes.UP:
        this.ballaste = Ballast.Fill;
        break;
      case Phaser.Input.Keyboard.KeyCodes.DOWN:
        this.ballaste = Ballast.Empty;
        break;
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
        this.submarine.moving = true;
        break;
      case Phaser.Input.Keyboard.KeyCodes.P:
        this.scene.start('GameOverScene', { score: 0 });
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  update() {

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

        if(this.submarine.x > this.lastScorePos) {
          this.lastScorePos = this.submarine.x
          this.score += Math.floor(this.lastScorePos/1000)
        }
        
      } else if (this.currentMovement === Movement.Backward) {
        this.submarine.setVelocityX(-SUBMARINE_SPEED_STEP)
      }
    } 

    //this.fpsText.update()
    this.background.update()
    this.submarine.update(this.currentMovement)


    this.ennemis.forEach(ennemi => {
      ennemi.update()
    });

   
  }

  resetCommand(event) {
    switch (event.which) {
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
        this.submarine.moving = false;
        break;
      case Phaser.Input.Keyboard.KeyCodes.UP:
        this.ballaste = Ballast.Keep;
        break;
      case Phaser.Input.Keyboard.KeyCodes.DOWN:
        this.ballaste = Ballast.Keep;
        break;
      default:
        break;
    }



  }

}
