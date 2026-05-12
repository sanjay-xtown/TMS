import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import bcrypt from "bcrypt";

const Driver = sequelize.define(
  "Driver",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "school_drivers",
    timestamps: true,
    hooks: {
      beforeCreate: async (driver) => {
        if (driver.password) {
          driver.password = await bcrypt.hash(driver.password, 10);
        }
      },
      beforeUpdate: async (driver) => {
        if (driver.changed("password")) {
          driver.password = await bcrypt.hash(driver.password, 10);
        }
      },
    },
  }
);

Driver.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default Driver;






