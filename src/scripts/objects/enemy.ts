import Submarine, { Movement } from "./submarine"

type EnemyType = 'octopus' | 'shark'
export default class Enemy extends Phaser.Physics.Matter.Sprite {


    runsAway: boolean = false
    yPosition: number = 0
    verticalMovement = Math.random() * 100 - 50
    submarine: Submarine
    currentVelocity: integer = -5

    constructor(scene: Phaser.Scene, x, y, enemyType: EnemyType, submarine: Submarine, onCollision: () => void) {
        super(scene.matter.world, x, y, enemyType.toString())
        this.yPosition = y
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.submarine = submarine
        this.setSize(128, 64)
        this.setDepth(4)

        var shapes = scene.cache.json.get(`${enemyType}-box`)

        this.setBody(shapes, { isStatic: false, frictionStatic : 0 ,friction: 1, frictionAir: 0 })


        //TODO : event after collision
        scene.physics.add.collider(submarine, this, onCollision);
        scene.physics.add.overlap(submarine.light.armLight, this, () => {

            if (!this.runsAway) {
                this.setVelocityX(7)
                this.setFlipX(true)

                if (Math.random() >= 0.5) {
                    let rot = Math.random() * 0.8 + 0.8
                    this.setRotation(rot)
                    this.setVelocityY(5)
                } else {
                    this.setRotation(-Math.random() * 0.8 - 0.8)
                    this.setVelocityY(-5)
                }
                this.runsAway = true
            }
        })
        this.setVelocityX(this.currentVelocity)
    }



    update(): void {

        this.setVelocityX(this.currentVelocity)
        
        if (this.body.position.y <= this.yPosition - this.verticalMovement) {
                this.setVelocityY(this.verticalMovement)
            }
        if (this.body.position.y >= this.yPosition + this.verticalMovement) {
            this.setVelocityY(-this.verticalMovement)
        }
    }
}    