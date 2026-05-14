import sequelize from '../src/config/db.js';
import { initModels, Bus } from '../src/models/initModels.js';

async function checkBuses() {
  try {
    await sequelize.authenticate();
    initModels();
    const buses = await Bus.findAll();
    console.log('Available Buses:');
    buses.forEach(b => {
      console.log(`- ID: ${b.id}, Number: ${b.busNumber}, Driver: ${b.driverName}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkBuses();
