import Submarine, { Movement } from "../objects/submarine"


export default class StartScene extends Phaser.Scene {
  submarine: any
  constructor() {
    super({
      key: 'StartScene', physics: {
        default: 'matter',
        matter: {
          debug: false,
          gravity: {
            y: 0
          }
        }
      }
    })
  }

  create() {

    const { width, height } = this.scale

    this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(0).setScale(width, height)
    this.add
      .text(150, height / 2, `Appuyer sur une touche \n pour commencer`, {
        color: '#000000',
        fontSize: '24px',
        align: 'center'

      })
      .setDepth(6)
    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0).setPosition(width / 2, height / 3)

    this.input.keyboard.on('keydown', (e) => {
      if (e.which === Phaser.Input.Keyboard.KeyCodes.F) {
        document.querySelector("#phaser-game")?.requestFullscreen();
      }
      else {
        this.scene.start('MainScene')
      }
    })
  }

  update(time: number, delta: number): void {
    this.submarine.update(Movement.Forward)
  }
}
