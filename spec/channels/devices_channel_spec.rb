require 'rails_helper'

RSpec.describe DevicesChannel, :type => :channel do
  xit "successfully subscribes" do
    subscribe
    expect(subscription).to be_confirmed
  end
end
