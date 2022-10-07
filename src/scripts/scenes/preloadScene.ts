export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Chargement...',
        style: {
            font: '20px monospace',
            color: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            color: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        percentText.setText(Math.round(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });
    this.load.atlas('submarine', 'assets/img/submarine.png', 'assets/img/submarine.json')
    this.load.atlas('submarinelight', 'assets/img/submarine-light.png', 'assets/img/submarine-light.json')
    this.load.image('background', 'assets/background/background.png')
    this.load.image('layer1', 'assets/background/layer1.png')
    this.load.image('layer2', 'assets/background/layer2.png')
    this.load.image('layer3', 'assets/background/layer3.png')
    this.load.image('bubble', 'assets/img/bubble.png')
    this.load.image('octopus', 'assets/img/poulpe.gif')
    this.load.image('shark', 'assets/img/shark.png')

    this.load.json('rock', 'assets/background/layer1-shapes.json')
  }

  create() {
    this.scene.start('StartScene')

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
