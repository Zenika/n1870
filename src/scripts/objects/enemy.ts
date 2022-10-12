import Submarine from "./submarine"

type EnemyType = 'octopus' | 'shark'

interface EnemyConfig {
    name: string;
    width: number;
    heigth: number;
    frames: number;
    animName: string;
}

const infos = {
    'octopus': {
        name: 'octopus',
        width: 128,
        heigth: 128,
        frames: 8,
        animName: 'octopus-anim'
    },
    'shark': {
        name: 'shark',
        width: 140,
        heigth: 55,
        frames: 10,
        animName: 'shark-anim'
    }
}
export default class Enemy extends Phaser.Physics.Arcade.Sprite {


    runsAway: boolean = false
    yPosition: number = 0
    verticalMovement = Math.random() * 100 - 50

    constructor(scene: Phaser.Scene, x, y, enemyType: EnemyType,  submarine: Submarine, onCollision: () => void) {
        super(scene, x, y, enemyType.toString())

        const enemyConfig: EnemyConfig = infos[enemyType]
        scene.textures.addSpriteSheetFromAtlas(enemyConfig.name + '-sheet', { atlas: enemyConfig.name, frame: enemyConfig.name, frameWidth: enemyConfig.width, frameHeight: enemyConfig.heigth })
        let frames = this.anims.generateFrameNames(enemyConfig.name + '-sheet', { start: 0, end: enemyConfig.frames - 1 })

        this.anims.create({
            key: enemyConfig.animName,
            frames: frames,
            frameRate: enemyConfig.frames,
            repeat: -1
        })
        this.play(enemyConfig.animName)
        this.yPosition = y
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setSize(128,64)
        this.setDepth(4)
        this.setVelocityY(this.verticalMovement)
        
        //TODO : event after collision
        scene.physics.add.collider(submarine, this, onCollision);
        scene.physics.add.overlap(submarine.light.armLight, this, () => {

            if (!this.runsAway) {
                this.setVelocityX(150)
                this.setFlipX(true)

                if (Math.random() >= 0.5) {
                    let rot = Math.random()*0.8+0.8
                    this.setRotation(rot)
                    this.setVelocityY(100)
                } else {
                    this.setRotation(-Math.random()*0.8-0.8)
                    this.setVelocityY(-100)
                }
                this.runsAway = true
            }

        })
        this.setVelocityX(-100)       
    }



    update(): void {
      //  this.setVelocityX(-100)
        if (this.body.y <= this.yPosition - this.verticalMovement) {
            this.setVelocityY(this.verticalMovement)
        }
        if (this.body.y >= this.yPosition + this.verticalMovement) {
            this.setVelocityY(-this.verticalMovement)
        }
    }
}    