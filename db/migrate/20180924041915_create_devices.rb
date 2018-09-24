class CreateDevices < ActiveRecord::Migration[5.2]
  def change
    create_table :devices, id: :uuid do |t|
      t.string :external_id, null: false
      t.boolean :online, null: false, default: true

      t.timestamps
    end
  end
end
