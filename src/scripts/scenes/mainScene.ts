import Submarine from '../objects/submarine'
import FpsText from '../objects/fpsText'
import Background from '../objects/background'

export default class MainScene extends Phaser.Scene {
  fpsText
  submarine: Submarine
  background: Phaser.GameObjects.TileSprite
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.textures.addSpriteSheetFromAtlas('sub-sheet', { atlas: 'all', frame: 'sub', frameWidth: 128 });
    
    this.anims.create({ key: 'sub-anim', frames: this.anims.generateFrameNumbers('sub-sheet', { start: 0, end: 10 }), frameRate: 10, repeat: -1 });

    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0)
    this.background = new Background(this)
    this.fpsText = new FpsText(this)
    this.cursors = this.input.keyboard.createCursorKeys();

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width-15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setPosition(this.cameras.main.width-150, -220)

    this.fpsText.setPosition(this.cameras.main.width-150, -190)  
    this.physics.world.setBoundsCollision(true, false, true, true)
    
    
  }

  update() {
    if (this.cursors.left.isDown)
    {
        this.submarine.setAccelerationX(-150)
    }
    else if (this.cursors.right.isDown)
    {
      this.submarine.setAccelerationX(150)
    } else {
      this.submarine.setAccelerationX(0)
    }

    if (this.cursors.up.isDown)
    {
      this.submarine.setAccelerationY(-150)
    }
    else if (this.cursors.down.isDown)
    {
      this.submarine.setAccelerationY(150)
    }else {
      this.submarine.setAccelerationY(0)
    }

    this.background.tilePositionX += this.submarine.body.deltaX() * 0.5;
    this.background.tilePositionY += this.submarine.body.deltaY() * 0.5;

    this.fpsText.update()
  }
}
