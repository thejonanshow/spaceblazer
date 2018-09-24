class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players, id: :uuid do |t|
      t.uuid :device_id, null: false
      t.string :avatar_slug, null: false
      t.uuid :game_id, null: false

      t.timestamps
    end
  end
end
