import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Tracking = sequelize.define('Tracking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  busId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  speed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM(
      'inactive', 
      'morning_pickup', 
      'school_reached', 
      'evening_drop', 
      'trip_completed', 
      'private_use', 
      'maintenance', 
      'breakdown', 
      'holiday'
    ),
    defaultValue: 'inactive',
  },
}, {
  tableName: 'tracking_locations',
  timestamps: true,
});

export default Tracking;
