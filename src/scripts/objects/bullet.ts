export default class Bullet extends Phaser.Physics.Matter.Sprite {
    speed: number;
    initPositionX: number;
    constructor(scene: Phaser.Scene) {
        super(scene.matter.world, 0, 0, 'bullet')
        this.setOrigin(0.5, 0.5)
        this.setScale(0.5)
        this.setDepth(5)
        this.setActive(false)
        this.setVisible(false)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setBody({

            type: 'rectangle',
            width: 42,
            height: 12
        }, {
            label: 'bullet',
        })
        this.setCollisionCategory(0x0004)
        this.setCollidesWith(0x0002)
        this.speed = Phaser.Math.GetSpeed(400, 1)
    }

    fire(x:number, y:number) {
        console.log('fire')
        this.setPosition(x, y)
        this.initPositionX = x

        this.setActive(true)
        this.setVisible(true)
    }

    explode() {
        this.setActive(false)
        this.setVisible(false)
        this.setPosition(0, 0)
    }

    update (time: number, delta: number)
    {
        this.x += this.speed * delta;

        if (this.x > this.initPositionX + 820)
        {
            this.setActive(false)
            this.setVisible(false)
        }
    }

}