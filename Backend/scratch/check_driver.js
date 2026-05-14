import { Bus } from '../src/modules/bus/bus.model.js';
import sequelize from '../src/config/db.js';

async function checkDriver() {
  try {
    const bus = await Bus.findOne({ where: { driverMobileNumber: '9345577285' } });
    if (bus) {
      console.log('--- BUS FOUND ---');
      console.log(`ID: ${bus.id}`);
      console.log(`Bus Number: ${bus.busNumber}`);
      console.log(`Driver: ${bus.driverName}`);
      console.log(`Mobile: ${bus.driverMobileNumber}`);
    } else {
      console.log('No bus found for driver mobile number: 9345577285');
    }
  } catch (error) {
    console.error('Error checking driver:', error);
  } finally {
    await sequelize.close();
  }
}

checkDriver();
