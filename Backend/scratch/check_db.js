import { School } from '../src/modules/school/school.model.js';
import { sequelize } from '../src/config/db.js';

async function checkDB() {
  try {
    await sequelize.authenticate();
    const schools = await School.findAll();
    console.log('SCHOOLS_IN_DB:', JSON.stringify(schools, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('DB_CHECK_ERROR:', err);
    process.exit(1);
  }
}

checkDB();
