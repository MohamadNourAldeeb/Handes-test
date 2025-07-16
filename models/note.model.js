import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";

class Note extends Model {}

Note.init(
  {
    _id: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
  },

  {
    sequelize,
    tableName: "notes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["_id"],
        name: "_id_index",
        using: "BTREE",
      },
    ],
  }
);

export default Note;
