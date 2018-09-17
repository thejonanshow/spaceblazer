class AddIndexToPlayer < ActiveRecord::Migration[5.2]
  def change
    add_index :players, [:client_side_id, :game_id], unique: true
  end
end
