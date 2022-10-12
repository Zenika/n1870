import Submarine, { Movement } from "./submarine"

type EnemyType = 'octopus' | 'shark' | 'fish'

const ENNEMY_DEFAULT_SPEED = 2

export default class Enemy extends Phaser.Physics.Matter.Sprite {


    runsAway: boolean = false
    yPosition: number = 0
    verticalMovement = Math.random() * 100 - 50
    submarine: Submarine
    currentVelocity: integer = -ENNEMY_DEFAULT_SPEED

    constructor(scene: Phaser.Scene, x, y, enemyType: EnemyType, submarine: Submarine, onCollision: () => void) {
        super(scene.matter.world, x, y, enemyType.toString())
        this.yPosition = y
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.submarine = submarine
        this.setDepth(4)

        var nbFrames = 0
        var width = 0, height = 0
        switch (enemyType) {
            case 'octopus':
                nbFrames = 8
                width = 128
                height = 128
                break;
            case 'shark':
                nbFrames = 10
                width = 128
                height = 50
                break;
            case 'fish':
                nbFrames = 10
                width = 64
                height = 64
                break;
            default:
                break;
        }
        this.setSize(width, height)

        var textture = scene.textures.addSpriteSheetFromAtlas(`${enemyType}-sheet`, { atlas: enemyType.toString(), frame: 'ennemy', frameWidth: width, frameHeight: height })
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
        this.setBounce(1)


        this.setFixedRotation()


        this.setVelocityX(this.currentVelocity)
    }



    update(): void {

        //this.setVelocityX(this.currentVelocity)

        if (this.body.position.y <= this.yPosition - this.verticalMovement) {
            this.setVelocityY(this.verticalMovement)
        }
        if (this.body.position.y >= this.yPosition + this.verticalMovement) {
            this.setVelocityY(-this.verticalMovement)
        }
    }

    escape(): void {
        if (!this.runsAway) {
            this.setVelocityX(ENNEMY_DEFAULT_SPEED+2)
            this.setFlipX(true)

            if (Math.random() >= 0.5) {
                let rot = Math.random() * 0.8 + 0.8
                this.setRotation(rot)
                this.setVelocityY(ENNEMY_DEFAULT_SPEED)
            } else {
                this.setRotation(-Math.random() * 0.8 - 0.8)
                this.setVelocityY(-ENNEMY_DEFAULT_SPEED)
            }
            this.runsAway = true

            this.scene.time.addEvent({
                delay: 10000,
                callback: () => {
                  this.runsAway = false
                  this.setVelocityX(ENNEMY_DEFAULT_SPEED)
                },
                loop: false
              })
        }

    }
}    