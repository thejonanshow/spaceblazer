class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.boolean :active, default: false, null: false
      t.jsonb :data, default: '{}', null: false

      t.timestamps
    end
  end
end
