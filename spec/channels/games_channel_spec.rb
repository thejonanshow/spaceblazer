require 'rails_helper'

RSpec.describe GamesChannel, :type => :channel do
  xit "successfully subscribes" do
    subscribe
    expect(subscription).to be_confirmed
  end

  context "#create_player" do
    let(:game) { Game.current }
    let(:device) { Device.new(external_id: SecureRandom.uuid) }

    it "creates a player for the current game" do
      subscribe

      expect {
        perform :create_player, { game_id: game.id, device_id: device.id }
      }.to change {
        Game.current.players.count
      }.from(0).to(1)
    end
  end
end
