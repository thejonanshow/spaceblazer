require 'rails_helper'
require './spec/channels/fake_object_builder'
include FakeObjectBuilder

RSpec.describe DevicesChannel, :type => :channel do
  context "when a player is created" do
    let(:game) { Game.current }

    it "broadcasts the new player to all online devices" do
      device = Device.create(external_id: SecureRandom.uuid)
      channel = build_fake('broadcast_to', described_class)

      expect(FakeDevicesChannel).to receive(:broadcast_to).with(
        device, instance_of(Player)
      )
      begin
        old_klass = DevicesChannel.dup
        Kernel.silence_warnings { DevicesChannel = FakeDevicesChannel }
        game.players.create(device_id: device.id)
      ensure
        Kernel.silence_warnings { DevicesChannel = old_klass }
      end
    end
  end
end
