import Phasar from 'phaser'
import config from '../config'
export default class Start extends Phasar.Scene {
  private background: Phasar.GameObjects.TileSprite

  private preload() {
    this.load.image('background', '/static/bg.png');
    // 名字，路径，宽，高，帧数
    this.load.spritesheet('galaxing-anim', '/static/galaxing.png', {
      frameWidth: 60,
      frameHeight: 40
    })
    this.load.image('airplane', '/static/airplane.png')
    this.load.image('bullet', '/static/bullet.png')
  }

  private create() {
    this.background = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'background')
    // START 文字
    var progressText = this.add.text(200, 1200, ' TAP TO START', {
      font: '24px FC',
      align: 'center',
      fill: '#ffffff'
    })

    progressText.x = 0.5
    progressText.y = 0.5
  }

  public update() {
    this.background.tilePositionY -= 0.5
  }
}