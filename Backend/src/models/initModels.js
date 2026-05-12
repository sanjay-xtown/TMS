import Parent from '../modules/parent/parent.model.js';
import Student from '../modules/student/student.model.js';
import BusLiveLocation from '../modules/tracking/tracking.model.js';
import BusTransferLog from '../modules/transfer/transfer.model.js';
import Admin from '../modules/auth/admin.model.js';
import Bus from '../modules/bus/bus.model.js';
import School from '../modules/school/school.model.js';
import User from '../modules/user/user.model.js';
import { BusStatus, BusLog } from '../modules/busStatus/busStatus.model.js';
import SuperAdmin from '../modules/auth/superadmin/superadmin.model.js';
import SchoolAdmin from '../modules/auth/schooladmin/schooladmin.model.js';
import Driver from '../modules/auth/schooladmin/driver.model.js';
import Route from '../modules/auth/schooladmin/route.model.js';


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

  // School - SchoolAdmin (One to Many)
  School.hasMany(SchoolAdmin, { foreignKey: 'schoolId', as: 'admins' });
  SchoolAdmin.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School - Driver (One to Many)
  School.hasMany(Driver, { foreignKey: 'schoolId', as: 'drivers' });
  Driver.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School - Route (One to Many)
  School.hasMany(Route, { foreignKey: 'schoolId', as: 'routes' });
  Route.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // Route - Bus (One to Many)
  Route.hasMany(Bus, { foreignKey: 'routeId', as: 'buses' });
  Bus.belongsTo(Route, { foreignKey: 'routeId', as: 'route' });
};

export { Parent, Student, BusLiveLocation, BusTransferLog, Admin, Bus, School, User, BusStatus, BusLog, SuperAdmin, SchoolAdmin, Driver, Route, initModels };
