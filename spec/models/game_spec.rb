require 'rails_helper'

RSpec.describe Game, type: :model do
  context "#start_game" do
    it "sets the start time on the game" do
      expect {
        Game.start_game
      }.to change {
        Game.current.start
      }.from(nil)
    end
  end

  context "#finish_game" do
    it "sets the end time on the game" do
      game = Game.current
      Game.start_game

      expect {
        Game.finish_game("data" => {})
      }.to change {
        game.reload.finish
      }.from(nil)
    end
  end
end
