class AddDataToGame < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :data, :jsonb
  end
end
