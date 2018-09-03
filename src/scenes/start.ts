import Phasar from 'phaser'
import config from '../config'
export default class Start extends Phasar.Scene {
  private background: Phasar.GameObjects.TileSprite
  private cursors

  private preload() {
    // 加载背景图片
    this.load.image('background', '/static/bg.png');
    // 加载
    this.load.spritesheet('galaxing-anim', '/static/galaxing.png', {
      frameWidth: 60,
      frameHeight: 40
    })
    this.load.image('airplane', '/static/airplane.png')
    this.load.image('bullet', '/static/bullet.png')
  }

  private create() {
    // 添加背景
    this.background = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'background')
    // 添加文字
    var progressText = this.add.text(100, 280, '开始游戏', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      metrics: {
        ascent: 45,
        descent: 10,
        fontSize: 55
      }
    })
    // 添加键盘监听
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  public update() {
    // 背景滚动效果
    this.background.tilePositionY -= 0.5

    // 按下空格开始游戏
    if (this.cursors.space.isDown) {
      this.scene.start('play')
    }
  }
}