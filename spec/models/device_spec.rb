require 'rails_helper'
require 'securerandom'

RSpec.describe Device, type: :model do
  context "#send_game" do
    let(:device) { Device.new(external_id: SecureRandom.uuid) }

    it "broadcasts the game info on the devices channel" do
      game = Game.current
      expect(DevicesChannel).to receive(:broadcast_to).with(device, game)
      device.send_game
    end
  end
end
