import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  busId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'students',
  timestamps: true,
});

export default Student;
