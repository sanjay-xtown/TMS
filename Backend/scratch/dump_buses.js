
import { Bus } from '../src/modules/bus/bus.model.js';
import sequelize from '../src/config/database.js';

async function dumpBuses() {
  try {
    await sequelize.authenticate();
    const buses = await Bus.findAll();
    console.log(JSON.stringify(buses, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpBuses();
