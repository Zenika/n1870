

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

    this.add.image(0, 0, 'gameover').setOrigin(0, 0).setScrollFactor(0)
    this.add
      .text(208, 475, `${this.score}`, {
        color: '#ffffff',
        fontSize: '28px',
        align: 'center',
        fixedWidth: 185,
      })
      .setDepth(6)
    this.input.keyboard.on('keydown', (event) => {
      if (event.which === Phaser.Input.Keyboard.KeyCodes.P) {
        this.scene.start('StartScene')
      }
    })
  }
}
