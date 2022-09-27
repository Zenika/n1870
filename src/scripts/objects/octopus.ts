import Submarine from "./submarine"

export default class Octopus extends Phaser.Physics.Arcade.Sprite {


    runsAway: boolean = false

    constructor(scene: Phaser.Scene, x, y, submarine: Submarine) {
        super(scene, x, y, 'octopus')
        scene.add.existing(this)
        scene.physics.add.existing(this)
       
        this.setSize(128,64)
    

        this.setDepth(4)
        
        //TODO : event after collision
        scene.physics.add.collider(submarine, this);
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
        
    }
}    