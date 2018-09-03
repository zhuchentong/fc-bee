export default {
  width: window.screen.width,
  height: window.screen.height,
  renderer: Phaser.AUTO,
  parent: '',
  resolution: 1,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
} 
