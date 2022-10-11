import Submarine, { Movement } from "./submarine"

type EnemyType = 'octopus' | 'shark'
export default class Enemy extends Phaser.Physics.Arcade.Sprite {


    runsAway: boolean = false
    yPosition: number = 0
    verticalMovement = Math.random() * 100 - 50
    submarine: Submarine
    currentVelocity: integer = -100

    constructor(scene: Phaser.Scene, x, y, enemyType: EnemyType, submarine: Submarine, onCollision: () => void) {
        super(scene, x, y, enemyType.toString())
        this.yPosition = y
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.submarine = submarine
        this.setSize(128, 64)
        this.setDepth(4)


        //TODO : event after collision
        scene.physics.add.collider(submarine, this, onCollision);
        scene.physics.add.overlap(submarine.light.armLight, this, () => {

            if (!this.runsAway) {
                this.setVelocityX(150)
                this.setFlipX(true)

                if (Math.random() >= 0.5) {
                    let rot = Math.random() * 0.8 + 0.8
                    this.setRotation(rot)
                    this.setVelocityY(100)
                } else {
                    this.setRotation(-Math.random() * 0.8 - 0.8)
                    this.setVelocityY(-100)
                }
                this.runsAway = true
            }
        })
        this.setVelocityX(this.currentVelocity)
    }



    update(): void {

        this.setVelocityX(this.currentVelocity)
        
        if (this.body.y <= this.yPosition - this.verticalMovement) {
                this.setVelocityY(this.verticalMovement)
            }
        if (this.body.y >= this.yPosition + this.verticalMovement) {
            this.setVelocityY(-this.verticalMovement)
        }
    }
}    