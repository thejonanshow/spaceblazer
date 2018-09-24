require 'rails_helper'

RSpec.describe GamesChannel, :type => :channel do
  xit "successfully subscribes" do
    subscribe
    expect(subscription).to be_confirmed
  end
end
