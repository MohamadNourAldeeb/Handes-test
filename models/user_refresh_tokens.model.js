import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { encrypt, encryptToken } from "../utils/aes_encrypting.js";

class UserRefreshToken extends Model {}

UserRefreshToken.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("token", value.trim());
      },
    },
    expired: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    device: { type: DataTypes.STRING, allowNull: false },
  },

  {
    sequelize,
    tableName: "user_refresh_tokens",
    timestamps: true,
    updatedAt: false,
    hooks: {
      beforeCreate: (user) => {
        user.token = encryptToken(user.token);
      },
    },
  }
);
export default UserRefreshToken;
