require 'rails_helper'
require 'securerandom'

RSpec.describe Device, type: :model do
  context "#send_game_info" do
    let(:device) { Device.new(external_id: SecureRandom.uuid) }

    it "broadcasts the game info on the devices channel" do
      game_json = Game.current.to_json(include: :players)
      expect(DevicesChannel).to receive(:broadcast_to).with(device, game_json)
      device.send_game_info
    end
  end
end
