import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

export const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  busRegisterNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  routeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  routeId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  driverMobileNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gpsDeviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
    defaultValue: "ACTIVE",
  },
}, {
  tableName: 'buses',
  timestamps: true,
});

export default Bus;
