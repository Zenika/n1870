export default class Background extends Phaser.GameObjects.TileSprite {
    constructor(scene) {
      super(scene, 400, 300, 0, 0, 'background')
      scene.add.existing(this)
  
      this.setScrollFactor(0);
    }
  }