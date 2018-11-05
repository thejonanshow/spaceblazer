import StarScene from 'game/scenes/star'
import MainScene from 'game/scenes/main'

export default {
  minimum_players: 4,
  disable_keyboard: true,
  player_speed: 5,
  enemy_speed: 7,
  game_start_countdown_ms: 3000,
  game_finish_countdown: 60,
  first_game: true,

  phaser: {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    backgroundColor: "000000",
    physics: {
      default: 'matter',
      matter: {
        debug: false
      }
    },
    scene: [new StarScene, new MainScene],
    audio: {
      disableWebAudio: true
    }
  }
}
