export default class Background extends Phaser.GameObjects.TileSprite {
    constructor(scene) {
      super(scene, 0, 0, 0, 0, 'background')
      scene.add.existing(this)
  
      this.setScrollFactor(0);
      this.setOrigin(0, 0);
    }
  }