import sequelize from '../src/config/db.js';
import { initModels, Parent, Student } from '../src/models/initModels.js';

async function checkLinks() {
  try {
    await sequelize.authenticate();
    initModels();
    const parents = await Parent.findAll({
      include: [{ model: Student, as: 'children' }]
    });

    parents.forEach(p => {
      console.log(`Parent: ${p.parentName} (${p.mobileNumber})`);
      console.log(`Children Count: ${p.children.length}`);
      p.children.forEach(c => {
        console.log(`  - Student: ${c.studentName}`);
      });
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkLinks();
