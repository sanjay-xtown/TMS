import sequelize from '../src/config/db.js';
import Parent from '../src/modules/parent/parent.model.js';

async function checkParents() {
  try {
    await sequelize.authenticate();
    const parents = await Parent.findAll();
    console.log('Total Parents:', parents.length);
    parents.forEach(p => {
      console.log(`Name: ${p.parentName}, Mobile: ${p.mobileNumber}, Password (Hashed): ${p.password}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkParents();
