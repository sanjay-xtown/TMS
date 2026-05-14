import { getAllSchools } from '../src/modules/school/school.service.js';
import { initModels } from '../src/models/initModels.js';

const test = async () => {
  try {
    initModels();
    const schools = await getAllSchools();
    console.log('SCHOOLS:', JSON.stringify(schools, null, 2));
  } catch (error) {
    console.error('TEST FAILED:', error);
  }
};

test();
