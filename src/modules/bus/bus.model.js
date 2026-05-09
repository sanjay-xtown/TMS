import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  busName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  gpsDeviceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  routeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true, // Allowed null to prevent sync error with existing rows
  },
  driverPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Allowed null to prevent sync error with existing rows
  },
}, {
  timestamps: true,
});
