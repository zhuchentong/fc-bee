import Phaser from 'phaser'
import Start from './scenes/start'
import Play from './scenes/play'
import Victory from './scenes/over'
import Over from './scenes/over'
import config from './config'
import 'normalize.css'
class App extends Phaser.Game {
  constructor(config) {
    super(config)
    this.scene.add('start', Start)
    this.scene.add('play', Play)
    this.scene.add('over', Over)

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