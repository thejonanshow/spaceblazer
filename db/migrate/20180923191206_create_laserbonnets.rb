class CreateLaserbonnets < ActiveRecord::Migration[5.2]
  def change
    create_table :laserbonnets do |t|
      t.string :pi_id
      t.boolean :online

      t.timestamps
    end
  end
end
