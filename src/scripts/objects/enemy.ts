import MainScene from "../scenes/mainScene"
import Submarine, { Movement } from "./submarine"

export type EnemyType = 'octopus' | 'shark' | 'fish'

const ENEMY_DEFAULT_SPEED = 0.5

export default class Enemy extends Phaser.Physics.Matter.Sprite {


    runsAway: boolean = false
    yPosition: number = 0
    verticalMovement = Math.floor(Math.random() * 100) - 50
    submarine: Submarine
    scene: MainScene
    enemyType: EnemyType
    speed: number = ENEMY_DEFAULT_SPEED

    constructor(scene: MainScene, x, y, enemyType: EnemyType, submarine: Submarine, onCollision: () => void) {
        super(scene.matter.world, x, y, enemyType.toString())
        this.yPosition = y
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.enemyType = enemyType

        this.submarine = submarine
        this.setDepth(6)
        this.scene = scene

        var nbFrames = 0
        var width = 0, height = 0
        switch (enemyType) {
            case 'octopus':
                nbFrames = 8
                width = 128
                height = 128
                this.speed = 0.5
                break;
            case 'shark':
                nbFrames = 10
                width = 128
                height = 50
                this.speed = 0.75
                break;
            case 'fish':
                nbFrames = 10
                width = 64
                height = 64
                this.speed = 1
                break;
            default:
                break;
        }
        this.setSize(width, height)

        if (!scene.textures.exists(enemyType + '-sheet')) {
            scene.textures.addSpriteSheetFromAtlas(`${enemyType}-sheet`, { atlas: enemyType.toString(), frame: 'ennemy', frameWidth: width, frameHeight: height })
        }
        let frames = this.anims.generateFrameNames(`${enemyType}-sheet`, { start: 0, end: nbFrames - 1 })


        this.anims.create({
            key: `${enemyType}-anim`,
            frames: frames,
            frameRate: 10,
            repeat: -1
        })

        this.play(`${enemyType}-anim`)

        var shapes = scene.cache.json.get(`${enemyType}-box`)

        this.setBody(shapes)
        this.setFixedRotation()
        this.setCollisionCategory(0x0004)
        this.setCollidesWith([0x0001, 0x0008])
        this.setCollisionGroup(0)

        this.setVelocityX(-this.speed)

        if (this.enemyType === "octopus") {
            if (Math.random() > 0.5) {
                this.setVelocityY(-this.speed)
            } else {
                this.setVelocityY(this.speed)
            }
        }
    }



    update(): void {
        if (!this.runsAway && this.enemyType === "octopus") {
            if (this.body.position.y <= (this.yPosition - this.verticalMovement)) {
                this.setVelocityY(this.speed)
            }
            if (this.body.position.y >= (this.yPosition + this.verticalMovement)) {
                this.setVelocityY(-this.speed)
            }

        }else if (this.runsAway) {
            const { width, height } = this.scene.scale            
            let visibleMaxX = this.scene.cameras.main.scrollX+width + this.width
            let visibleMaxY = height + this.height

            if(this.x >= visibleMaxX || this.y < 0 || this.y >= visibleMaxY) {
                this.scene.removeEnemy(this)
                this.destroy()
            }
        }

    }

    escape(): void {
        if (!this.runsAway) {
            this.scene.score += 200
            this.setVelocityX(this.speed+1)
            this.setFlipX(true)



            if (this.enemyType === "octopus") {
                if (Math.random() >= 0.5) {
                    let rot = Math.random() * 0.8
                    this.setAngle(rot)
                    this.setVelocityY(this.speed)
                } else {
                    let rot = -Math.random() * 0.8
                    this.setAngle(rot)
                    this.setVelocityY(-this.speed)
                }
            }
            this.runsAway = true
        }
  }

  static getRandomEnemyType(): EnemyType {
    const randomNumber = Math.floor(Math.random() * 3)
    switch (randomNumber) {
      case 0:
        return 'octopus'
      case 1:
        return 'shark'
      case 2:
        return 'fish'
      default:
        return 'octopus'
    }
  }
}
