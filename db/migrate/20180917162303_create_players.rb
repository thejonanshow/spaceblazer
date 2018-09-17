class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players do |t|
      t.string :client_side_id
      t.string :avatar
      t.string :color
      t.integer :game_id

      t.timestamps
    end
  end
end
