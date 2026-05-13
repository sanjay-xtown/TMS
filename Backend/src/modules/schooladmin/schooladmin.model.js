import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import bcrypt from "bcrypt";

export const SchoolAdmin = sequelize.define("SchoolAdmin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  adminName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "school_admin",
  }
}, {
  tableName: 'school_admins',
  timestamps: true,
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  }
});

SchoolAdmin.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default SchoolAdmin;
