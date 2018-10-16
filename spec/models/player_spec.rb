require 'rails_helper'

RSpec.describe Player, type: :model do
  context "#generate_avatar_slug" do
    it "uses every color before repeating"
    it "uses every character before repeating"
    it "uses every available slug before repeating"
  end

  context "#avatar_slug" do
    it "is unique for a game with fewer than (colors * characters) players"
  end
end
