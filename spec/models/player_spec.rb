require 'rails_helper'

RSpec.describe Player, type: :model do
  let(:game) { Game.current }
  let(:external_id) { SecureRandom.uuid }
  let(:device) { Device.create(external_id: external_id) }
  let(:player) { Player.create(device: device, game: game) }

  context "#assign_slug" do
    it "uses every color before repeating" do
      used_colors = [player.color]
      unused_colors = Game::COLORS.dup - [player.color]

      (Game::COLORS.length - 1).times do
        new_player = Player.create(device: device, game: game) 

        expect {
          used_colors << unused_colors.delete(new_player.color)
        }.to change {
          unused_colors.length
        }.by(-1)
      end
    end

    it "uses every character before repeating" do
      used_characters = [player.character]
      unused_characters = Game::CHARACTERS - [player.character]

      (Game::CHARACTERS.length - 1).times do
        new_player = Player.create(device: device, game: game) 

        expect {
          used_characters << unused_characters.delete(new_player.character)
        }.to change {
          unused_characters.length
        }.by(-1)
      end
    end

    it "uses every available slug before repeating" do
      all_slugs = Game::ALL_AVATARS
      used_slugs = [player.avatar_slug]
      unused_slugs = all_slugs - used_slugs

      (all_slugs.length - 1).times do |slug|
        new_player = Player.create(device: device, game: game) 

        expect {
          used_slugs << unused_slugs.delete(new_player.avatar_slug)
        }.to change {
          unused_slugs.length
        }.by(-1)
      end
    end

    it "is unique for a game with fewer than (colors * characters) players"
  end
end
