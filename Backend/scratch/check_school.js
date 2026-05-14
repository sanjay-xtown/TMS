import { Bus } from '../src/modules/bus/bus.model.js';
import School from '../src/modules/school/school.model.js';
import sequelize from '../src/config/db.js';

async function checkSchool() {
  try {
    const bus = await Bus.findByPk('a3d459a9-bc52-49f6-a65b-679fda98104c');
    if (bus) {
      const school = await School.findByPk(bus.schoolId);
      if (school) {
        console.log('--- SCHOOL FOUND ---');
        console.log(`Name: ${school.schoolName}`);
        console.log(`Latitude: ${school.latitude}`);
        console.log(`Longitude: ${school.longitude}`);
      } else {
        console.log('No school found for ID:', bus.schoolId);
      }
    } else {
      console.log('No bus found for ID: a3d459a9-bc52-49f6-a65b-679fda98104c');
    }
  } catch (error) {
    console.error('Error checking school:', error);
  } finally {
    await sequelize.close();
  }
}

checkSchool();
