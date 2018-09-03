import Phasar from 'phaser'
import config from '../config'
export default class Defeat extends Phasar.Scene {
  private background: Phasar.GameObjects.TileSprite

  private preload() {
    this.load.image('background', '/static/bg.png');

  }
  private create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
  }

  public update() {
    this.background.tilePositionX += 0.5
  }
}