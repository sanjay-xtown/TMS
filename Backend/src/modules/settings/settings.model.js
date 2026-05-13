import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

export const Setting = sequelize.define("Setting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'settings',
  timestamps: true,
});

export default Setting;
