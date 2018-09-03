import Phasar, { ScaleModes } from 'phaser'
import config from '../config'
export default class Play extends Phasar.Scene {
  private player: Phasar.Physics.Arcade.Sprite // 飞机对象
  private bullets: Phasar.Physics.Arcade.Group // 子弹容器
  private bees: Phasar.Physics.Arcade.Group // 蜜蜂容器
  private cursors: CursorKeys
  private playSpeed = 2
  private bulletSpeed = 10
  private beeSpeed = 8
  private beeMoveDirection = 1
  private background
  private attacks: Phasar.GameObjects.Group
  private level = 1
  private gameOver = false
  public preload() {
  }

  public create() {
    // TODO:分数&时间
    this.attacks = this.add.group()

    this.background = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'background')
    // 创建飞机
    this.createPlayer()
    // 创建蜜蜂
    this.createBees()

    // 创建子弹列表
    this.bullets = this.physics.add.group()

    // 添加交互监听
    this.cursors = this.input.keyboard.createCursorKeys();
    // 飞机射击处理
    this.onPlayerFire()
  }

  public update() {
    // 背景滚动效果
    this.background.tilePositionY -= 0.5
    // 飞机移动处理
    this.onPlayerMove()

    // 游戏胜利检测
    this.onVictory()
    // 蜜蜂越界检测
    this.onBeeDead()
    // 子弹移动
    this.bulletMove()
    // 蜜蜂攻击
    this.beeAttack()
    // 蜜蜂移动
    this.beeMove()
    // 碰撞检测
    this.hitTest()
    // 游戏失败检测
    this.onDefeat()
  }
  onDefeat() {
    if (this.gameOver) {
      this.scene.start('defeat')
    }
  }
  /**
   * 游戏胜利 
   */
  onVictory() {
    if (this.bees.getLength() <= 0) {
      //TODO:游戏胜利
      this.scene.start('victory')
    }
  }

  /**
   * 矩形碰撞检测
   */
  hitTest() {
    // 子弹蜜蜂碰撞检测
    this.physics.add.overlap(this.bees, this.bullets, (bee: Phaser.Physics.Arcade.Sprite, bullet: Phaser.Physics.Arcade.Sprite) => {
      bee.visible = false
      bee.active = false
      this.bees.remove(bee)

      bullet.visible = false
      bullet.active = false
      this.bullets.remove(bullet)
    }, null);

    // 玩家蜜蜂碰撞检测
    this.physics.add.overlap(this.player, this.bees, (player: Phaser.Physics.Arcade.Sprite, bee: Phaser.Physics.Arcade.Sprite) => {
      // TODO:GAME OVER
      this.gameOver = true
    }, null);
  }

  onBeeDead() {
    this.attacks.children.each((bee: Phaser.GameObjects.Sprite) => {
      if (bee.y > config.height + bee.height / 2) {
        bee.active = false
        this.attacks.remove(bee)
        this.bees.remove(bee)
      }
    }, this)
  }

  /**
   * 蜜蜂移动
   */
  beeMove() {
    let { height, width } = this['plugins'].game.config


    if (this.bees.children.entries.some((bee: Phaser.GameObjects.Sprite) => bee.x < bee.width / 4)) {
      this.beeMoveDirection *= -1
    }

    if (this.bees.children.entries.some((bee: Phaser.GameObjects.Sprite) => bee.x > width - bee.width / 4)) {
      this.beeMoveDirection *= -1
    }

    Phasar.Actions.Call(this.bees.getChildren().filter(bee => !this.attacks.contains(bee)), (bee: Phaser.GameObjects.Sprite) => {
      bee.x += (this.beeMoveDirection * 1)
    }, this)
  }

  /**
   * 蜜蜂攻击
   */
  beeAttack() {
    // 添加攻击者
    if (this.attacks.getLength() < this.level) {
      Array.of(this.level - this.attacks.getLength()).forEach(index => {
        this.attacks.add(this.bees.children.entries[Math.floor(Math.random() * this.bees.getLength())] as Phasar.GameObjects.Sprite)
      })
    }

    // 攻击者移动
    this.attacks.children.each(attack => {
      let a = this.player.x + this.player.width / 2 - attack.x - attack.width / 2
      let b = this.player.y + this.player.height / 2 - attack.y - attack.height / 2
      let c = Math.sqrt(a * a + b * b)

      let speed_x = a / c * this.beeSpeed
      let speed_y = b / c * this.beeSpeed

      attack.x += speed_x
      attack.y += Math.max(speed_y, 1)
    }, this)
  }

  /**
   * 创建蜜蜂
   */
  createBees() {
    let map = [
      2, 2, 2, 2, 2, 2,
      1, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0
    ]

    this.bees = this.physics.add.group()

    // 创建蜜蜂小分队
    map.forEach((item, index) => {
      var bee = this.add.sprite(((index % 6) * 40) + 80, Math.floor(index / 6) * 30 + 30, 'galaxing-anim')
      bee.setScale(0.5)
      bee.active = true

      let animationName = 'fly_' + item + '_' + (index % 2)
      let animation = this.anims.get(animationName)

      if (!animation) {
        this.anims.create({
          key: animationName,
          frames: [
            {
              key: 'galaxing-anim',
              frame: item * 2 + (index % 2 ? 0 : 1)
            },
            {
              key: 'galaxing-anim',
              frame: item * 2 + (index % 2 ? 1 : 0)
            }
          ],
          frameRate: 2,
          repeat: -1
        });
      }

      bee.play(animationName, true, 2)
      this.bees.add(bee)
    })
  }

  /**
   * 子弹运动
   */
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
    this.player = this.physics.add.sprite(width / 2, height - 120 / 2, 'airplane')
    this.player.scaleX = 0.5
    this.player.scaleY = 0.5
  }

  /**
   * 飞机射击处理
   */
  private onPlayerFire() {
    this.input.keyboard.on('keydown', (event) => {
      if (event.code === 'Space') {
        this.createBullet()
      }
    });
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