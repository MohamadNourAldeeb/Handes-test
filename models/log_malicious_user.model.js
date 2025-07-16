import dotenv from 'dotenv';
dotenv.config({ path: `../.env` });
import { sequelize } from '../utils/connect.js';
import { DataTypes, Model } from 'sequelize';

class LogMaliciousUser extends Model {}

LogMaliciousUser.init(
  {
    _id: { type: DataTypes.UUID, allowNull: false, unique: true },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {},
    },
  },

  {
    sequelize,
    tableName: 'log_malicious_user',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['_id'],
        name: '_id_index',
        using: 'BTREE',
      },
    ],
  },
);
export default LogMaliciousUser;
