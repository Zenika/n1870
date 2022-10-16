

export default class GameOverScene extends Phaser.Scene {
  score: number = 0
  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    const { width, height } = this.scale

    this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(0).setScale(width, height)
    this.add
      .text(150, height / 2, `Game Over`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setDepth(6)
    this.add
      .text(150, height / 2 + 50, `Votre score ${this.score}`, {
        color: '#000000',
        fontSize: '24px',
        align: 'center',
      })
      .setDepth(6)
    this.input.keyboard.on('keydown', (event) => {
      if (event.which === Phaser.Input.Keyboard.KeyCodes.P) {
        this.scene.start('StartScene')
      }
    })
  }
}
