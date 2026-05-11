import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

// Latest state per bus
export const BusStatus = sequelize.define("BusStatus", {
  busId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  speed: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("moving", "stopped", "offline"),
    allowNull: false,
    defaultValue: "offline",
  },
}, {
  timestamps: true,
  tableName: "bus_status",
});

// History of all GPS updates
export const BusLog = sequelize.define("BusLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  busId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  speed: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false, // Only createdAt is needed for logs
  tableName: "bus_logs",
});
