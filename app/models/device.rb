class Device < ApplicationRecord
  validates :external_id, presence: true, uniqueness: true
  validates :online, presence: true
end
