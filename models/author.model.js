import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { bcrypt } from "../utils/bcrypt.js";
import { enumStateOfEmail } from "../utils/enums.js";

class Author extends Model {}

Author.init(
  {
    _id: { type: DataTypes.STRING, allowNull: false, unique: true },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("author_name", value.trim());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value.trim());
      },
    },
    email_state: {
      type: DataTypes.ENUM,
      values: Object.values(enumStateOfEmail),
      defaultValue: enumStateOfEmail.un_verified,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },

  {
    sequelize,
    tableName: "authors",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["_id"],
        name: "_id_index",
        using: "BTREE",
      },
    ],
    //! Triggers
    hooks: {
      beforeUpdate: (author) => {
        if (author.password) {
          author.password = bcrypt(author.password);
        }
      },
      beforeCreate: (author) => {
        if (author.password) author.password = bcrypt(author.password);
      },
    },
  }
);

export default Author;
