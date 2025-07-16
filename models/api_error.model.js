import { sequelize } from '../utils/connect.js';
import { DataTypes, Model } from 'sequelize';
import { enumTypeError } from '../utils/enums.js';

class ApiError extends Model {}

ApiError.init(
  {
    code: { type: DataTypes.INTEGER, allowNull: false },
    message: {
      type: DataTypes.STRING(500),
      allowNull: false,
      set(value) {
        this.setDataValue('message', value.trim());
      },
    },
    file: {
      type: DataTypes.STRING(300),
      allowNull: false,
      set(value) {
        this.setDataValue('file', value.trim());
      },
    },
    line: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(Object.values(enumTypeError)),
      allowNull: false,
      defaultValue: enumTypeError.backend,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: 'api_errors',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  },
);

export default ApiError;
