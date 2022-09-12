import Submarine, { Movement } from "../objects/submarine"


export default class StartScene extends Phaser.Scene {
  submarine: any
  constructor() {
    super({ key: 'StartScene' })
  }

  create() {
    const { width, height } = this.scale

    this.add.image(0, 0, 'sky').setOrigin(0, 0).setScrollFactor(0).setScale(width, height)
    // display the Phaser.VERSION
    this.add
      .text(150, height / 2, `Appuyer sur une touche pour commencer`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setDepth(6)
    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0).setPosition(400, 200)

    this.input.keyboard.on('keydown', (e) => {
      this.scene.start('MainScene')
    })
  }

  update(time: number, delta: number): void {
    this.submarine.update(Movement.Forward)
  }
}
