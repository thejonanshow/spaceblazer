require 'rails_helper'
require 'securerandom'

RSpec.describe Display, type: :model do
  context "#send_game_info" do
    let(:display) { Display.new(external_id: SecureRandom.uuid) }

    it "broadcasts the game info on the devices channel" do
      game_json = Game.current.to_json(include: :players)
      expect(DisplaysChannel).to receive(:broadcast_to).with(display, game_json)
      display.send_game_info
    end
  end
end
