import 'phaser'
import GameOverScene from './scenes/gameOverScene'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import StartScene from './scenes/startScene'

const DEFAULT_WIDTH = 600
const DEFAULT_HEIGHT = 600

const config = {
  type: Phaser.AUTO,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scale: {
    parent: 'phaser-game',
    expandParent: true,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, StartScene, MainScene, GameOverScene],
  physics: {
    default : 'arcade',
    arcade: {
      debug: false,
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
