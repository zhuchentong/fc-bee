import Phasar from 'phaser'
import config from '../config'
export default class Over extends Phasar.Scene {
  private background: Phasar.GameObjects.TileSprite

  private preload() {

  }
  private create(data) {
    this.background = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'background')

    var progressText = this.add.text(0, 0, data.state, {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      metrics: {
        ascent: 45,
        descent: 10,
        fontSize: 55
      }
    })
    progressText.x = config.width / 2 - progressText.width / 2
    progressText.y = config.height / 2 - progressText.height / 2

    progressText.setInteractive();
    progressText.on('pointerdown', () => {
      this.scene.start('play')
    });

  }

  public update() {
    this.background.tilePositionY -= 0.5
  }
}