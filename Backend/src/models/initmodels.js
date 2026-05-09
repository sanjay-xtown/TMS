import Parent from '../modules/parent/parent.model.js';
import Student from '../modules/student/student.model.js';
import Tracking from '../modules/tracking/tracking.model.js';
import BusTransferLog from '../modules/transfer/transfer.model.js';
import Admin from '../modules/auth/admin.model.js';

const initModels = () => {
  // Parent - Student (One to Many)
  Parent.hasMany(Student, { foreignKey: 'parentId', as: 'children' });
  Student.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });

  // Student - Bus Transfer Logs (One to Many)
  Student.hasMany(BusTransferLog, { foreignKey: 'studentId', as: 'transferLogs' });
  BusTransferLog.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

  // Tracking belongs to a Bus (simulated here by busId)
  // We can add associations with a Bus model here if it's created.
};

export { Parent, Student, Tracking, BusTransferLog, Admin, initModels };
