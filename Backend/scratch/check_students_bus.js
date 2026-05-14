import sequelize from '../src/config/db.js';
import { initModels, Student } from '../src/models/initModels.js';

async function checkStudents() {
  try {
    await sequelize.authenticate();
    initModels();
    const students = await Student.findAll();
    students.forEach(s => {
      console.log(`Student: ${s.studentName}, Bus ID: ${s.currentBusId}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkStudents();
