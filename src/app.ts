import Phaser from 'phaser'
import Start from './scenes/start'
import Play from './scenes/play'
import Victory from './scenes/victory'
import Defeat from './scenes/defeat'
import config from './config'
import 'normalize.css'
class App extends Phaser.Game {
  constructor(config) {
    super(config)
    // TODO:添加状态
    this.scene.add('start', Start)
    this.scene.add('play', Play)
    this.scene.add('victory', Victory)
    this.scene.add('defeat', Defeat)

    this.scene.start('start')
  }
}

/**
 * 启动项目
 */
function StartApp() {
  let app = new App(config)
}

window.onload = () => {
  StartApp()
}