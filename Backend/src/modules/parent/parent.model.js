import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcrypt';

const Parent = sequelize.define('Parent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    // unique: true would cause duplicate-null violations when email is omitted.
    // Uniqueness is enforced at the DB level only when a value is present.
    unique: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  invitationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'parents',
  timestamps: true,
  hooks: {
    beforeCreate: async (parent) => {
      if (parent.password) {
        parent.password = await bcrypt.hash(parent.password, 10);
      }
    },
    beforeUpdate: async (parent) => {
      // Only rehash if the password field was explicitly changed
      if (parent.changed('password') && parent.password) {
        parent.password = await bcrypt.hash(parent.password, 10);
      }
    },
  }
});


Parent.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default Parent;
