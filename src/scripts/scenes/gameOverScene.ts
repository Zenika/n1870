

export default class GameOverScene extends Phaser.Scene {
  score: number = 0
  constructor() {
    super({ key: 'GameOverScene' })
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    this.add.image(0, 0, 'gameover').setOrigin(0, 0).setScrollFactor(0)
    this.add
      .text(208, 464, `${this.score}`, {
        color: '#af802a',
        fontSize: '28px',
        align: 'center',
        fixedWidth: 188,
      })
      .setDepth(6)
    
    this.input.keyboard.on('keydown', (event) => {
      if (event.which === Phaser.Input.Keyboard.KeyCodes.P
        || event.which === Phaser.Input.Keyboard.KeyCodes.R) {
        this.scene.start('StartScene')
      }
    })
  }
}
