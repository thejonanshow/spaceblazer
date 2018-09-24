class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games, id: :uuid do |t|
      t.datetime :start, unique: true
      t.datetime :finish, unique: true

      t.timestamps
    end
  end
end
