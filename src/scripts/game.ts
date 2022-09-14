import 'phaser'
import GameOverScene from './scenes/gameOverScene'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import StartScene from './scenes/startScene'

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, StartScene, MainScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)


})
