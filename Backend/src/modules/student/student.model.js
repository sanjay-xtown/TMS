import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pickupPoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  currentBusId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'students',
  timestamps: true,
});

export default Student;
