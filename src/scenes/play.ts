import Phasar, { ScaleModes } from 'phaser'

export default class Play extends Phasar.Scene {
  private player: Phasar.GameObjects.Sprite // 飞机对象
  private bullets: Phasar.GameObjects.Group
  private cursors: CursorKeys
  private playSpeed = 2
  private bulletSpeed = 10
  private background

  public preload() {

  }

  public create() {
    let { height, width } = this['plugins'].game.config

    this.background = this.add.tileSprite(0, 0, width * 2, height * 2, 'background')
    // 创建飞机
    this.createPlayer()
    // 创建子弹列表
    this.bullets = this.add.group()
    // 添加交互监听
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  public update() {
    // 背景滚动效果
    this.background.tilePositionY -= 0.5
    // 飞机移动处理
    this.onPlayerMove()
    this.onPlayerFire()

    this.bulletMove()
  }

  bulletMove() {
    this.bullets.children.each((bullet: Phasar.GameObjects.Sprite) => {
      if (bullet.active && bullet.y < -20) {
        bullet.active = false
        this.bullets.remove(bullet)
      } else {
        bullet.y -= this.bulletSpeed
      }
    }, this)
  }

  /**
   * 创建子弹
   * TODO: 一次出现4个子弹
   */
  private createBullet() {
    // 获取消失的子弹
    let bullet = this.bullets.getFirstDead() as Phasar.GameObjects.Sprite

    if (bullet) {
      bullet.setPosition(this.player.x, this.player.y - 15)
    } else {
      bullet = this.add.sprite(this.player.x, this.player.y - 15, 'bullet')
      bullet.setScale(0.5)
    }

    this.bullets.add(bullet)
  }

  private createPlayer() {
    // 获取屏幕高度
    let { height, width } = this['plugins'].game.config
    this.player = this.add.sprite(width / 2, height - 120 / 2, 'airplane')
    this.player.scaleX = 0.5
    this.player.scaleY = 0.5
  }

  private onPlayerFire() {
    if (this.cursors.space.isDown) {
      this.createBullet()
    }
  }

  private onPlayerMove() {
    let opt = [
      {
        key: 'up',
        direction: 'y',
        speed: this.playSpeed * -1
      },
      {
        key: 'down',
        direction: 'y',
        speed: this.playSpeed * 1
      },
      {
        key: 'left',
        direction: 'x',
        speed: this.playSpeed * -1
      },
      {
        key: 'right',
        direction: 'x',
        speed: this.playSpeed * 1
      }
    ]

    opt.forEach(({ key, direction, speed }) => {
      if (this.cursors[key] && this.cursors[key].isDown) {
        this.player[direction] += speed
      }
    })
  }
}