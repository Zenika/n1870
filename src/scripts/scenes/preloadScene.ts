export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.atlas('all', 'assets/all.png', 'assets/all.json')
    this.load.image('toplayer', 'assets/background/TopLayer.png')
    this.load.image('light', 'assets/background/Light.png')
    this.load.image('middlelayer', 'assets/background/MiddleLayer.png')
    this.load.image('downlayer', 'assets/background/DownLayer.png')
    this.load.image('sky', 'assets/background/Sky.png')
    this.load.image('bubble', 'assets/img/bubble.png')
    this.load.image('octopus', 'assets/img/poulpe.gif')
  }

  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
