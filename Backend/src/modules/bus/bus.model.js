import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

export const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "ACTIVE",
  },
}, {
  tableName: 'buses',
  timestamps: true,
});

export default Bus;
