import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";

const Route = sequelize.define(
  "Route",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    routeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "school_routes",
    timestamps: true,
  }
);

export default Route;




