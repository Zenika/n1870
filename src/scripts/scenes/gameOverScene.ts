

export default class GameOverScene extends Phaser.Scene {
  score: number = 0
  creditText: Phaser.GameObjects.Text;
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
    this.creditText = this.add
      .text(150, 580, `Créé par Arthur, Chloé, Guillaume M, Guillaume R, Jérémy, Patrice, Stéphane`, {
        color: '#ffffff',
        fontSize: '16px',
        align: 'center',
      })
      .setDepth(6)
    
    this.input.keyboard.on('keydown', (event) => {
      if (event.which === Phaser.Input.Keyboard.KeyCodes.P
        || event.which === Phaser.Input.Keyboard.KeyCodes.R) {
        this.scene.start('StartScene')
      }
    })
  }

  update() {
    this.creditText.x -= 1
    if (this.creditText.x < -600) {
      this.creditText.x = 600
    }
  }
}
