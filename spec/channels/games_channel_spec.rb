require 'rails_helper'
require './spec/channels/fake_object_builder'
include FakeObjectBuilder

RSpec.describe GamesChannel, :type => :channel do
  let(:game) { Game.current }
  let(:external_id) { SecureRandom.uuid }
  let(:device) { Device.create(external_id: external_id) }

  context "#create_player" do
    it "creates a player for the current game" do
      channel = build_fake('create_player', described_class)

      expect {
        channel.create_player(
          {
            "game_id" => game.id,
            "external_id" => device.external_id
          }
        )
      }.to change {
        Game.current.players.count
      }.from(0).to(1)
    end
  end

  context "when a player is created" do
    it "broadcasts the new player to the game channel" do
      channel = build_fake('broadcast_to', described_class)

      expect(FakeGamesChannel).to receive(:broadcast_to).with(
        game,
        event: :player_created,
        player: instance_of(Player)
      )
      begin
        old_klass = GamesChannel.dup
        Kernel.silence_warnings { GamesChannel = FakeGamesChannel }
        game.players.create!(device_id: device.id)
      ensure
        Kernel.silence_warnings { GamesChannel = old_klass }
      end
    end
  end
end
