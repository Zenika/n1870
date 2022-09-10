import Submarine from "./submarine"

export default class Octopus extends Phaser.Physics.Arcade.Sprite {




    constructor(scene: Phaser.Scene, x, y, submarine: Submarine) {
        super(scene, x, y, 'octopus')
        scene.add.existing(this)
        scene.physics.add.existing(this)
       
        this.setSize(128,64)
    

        this.setDepth(3)
        
        //TODO : event after collision
        scene.physics.add.collider(submarine, this,() => {console.log("hit")}, () => {console.log("hit2"); return true});
        scene.physics.add.overlap(submarine.light.polygon, this, () => {
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
        })
        this.setVelocityX(-100)
 
        
    }



    update(): void {
      //  this.setVelocityX(-100)
        
    }
}    