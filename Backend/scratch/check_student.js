import Student from '../src/modules/student/student.model.js';
import sequelize from '../src/config/db.js';

async function checkStudent() {
  try {
    const student = await Student.findOne({ 
      where: { currentBusId: 'a3d459a9-bc52-49f6-a65b-679fda98104c' } 
    });
    if (student) {
      console.log('--- STUDENT FOUND ---');
      console.log(`Name: ${student.studentName}`);
      console.log(`Pickup Lat: ${student.pickupLat}`);
      console.log(`Pickup Lng: ${student.pickupLng}`);
    } else {
      console.log('No student found for Bus ID: a3d459a9-bc52-49f6-a65b-679fda98104c');
    }
  } catch (error) {
    console.error('Error checking student:', error);
  } finally {
    await sequelize.close();
  }
}

checkStudent();
