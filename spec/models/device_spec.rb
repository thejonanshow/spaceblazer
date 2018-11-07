require 'rails_helper'
require 'securerandom'

RSpec.describe Device, type: :model do
  let(:game) { Game.current }
  let(:external_id) { SecureRandom.uuid }
  let(:device) { Device.create(external_id: external_id) }

  context "#send_game_info" do
    it "broadcasts the game info on the devices channel" do
      game_json = Game.current.to_json(include: :players)
      expect(DevicesChannel).to receive(:broadcast_to).with(device, game_json)
      device.send_game_info
    end
  end

  context "#online!" do
    it "marks the device as online" do
      device.offline!
      expect { device.online! }.to change { device.online }.from(false).to(true)
    end

    it "broadcasts the online device to the devices channel" do
      expect(DevicesChannel).to receive(:broadcast_to).with(
        "devices",
        event: "device_online",
        device: device
      )

      device.online!
    end
  end

  context "#offline!" do
    it "marks the device as offline" do
      device.online!
      expect { device.offline! }.to change { device.online }.from(true).to(false)
    end

    it "broadcasts the offline device to the devices channel" do
      expect(DevicesChannel).to receive(:broadcast_to).with(
        "devices",
        event: "device_offline",
        device: device
      )

      device.offline!
    end
  end
end
