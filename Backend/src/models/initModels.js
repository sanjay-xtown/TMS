import Parent from '../modules/parent/parent.model.js';
import Student from '../modules/student/student.model.js';
import BusLiveLocation from '../modules/tracking/tracking.model.js';
import BusTransferLog from '../modules/transfer/transfer.model.js';
import Admin from '../modules/auth/admin.model.js';
import Bus from '../modules/bus/bus.model.js';
import School from '../modules/school/school.model.js';
import User from '../modules/user/user.model.js';
import { BusStatus, BusLog } from '../modules/busStatus/busStatus.model.js';

const initModels = () => {
  // Parent - Student (One to Many)
  Parent.hasMany(Student, { foreignKey: 'parentId', as: 'children' });
  Student.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });

  // Student - Bus Transfer Logs (One to Many)
  Student.hasMany(BusTransferLog, { foreignKey: 'studentId', as: 'transferLogs' });
  BusTransferLog.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

  // School - Bus (One to Many)
  School.hasMany(Bus, { foreignKey: 'schoolId', as: 'buses' });
  Bus.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // Student - School (Many to One)
  Student.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  School.hasMany(Student, { foreignKey: 'schoolId', as: 'students' });

  // Bus - BusLiveLocation (One to One)
  Bus.hasOne(BusLiveLocation, { foreignKey: 'busId', as: 'liveLocation' });
  BusLiveLocation.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });

  // Student - Bus (Many to One)
  Student.belongsTo(Bus, { foreignKey: 'currentBusId', as: 'bus' });
  Bus.hasMany(Student, { foreignKey: 'currentBusId', as: 'students' });

  // School - Admin (One to Many)
  School.hasMany(Admin, { foreignKey: 'schoolId', as: 'admins' });
  Admin.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
};

export { Parent, Student, BusLiveLocation, BusTransferLog, Admin, Bus, School, User, BusStatus, BusLog, initModels };
