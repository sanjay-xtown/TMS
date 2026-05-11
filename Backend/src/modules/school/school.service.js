import { School } from './school.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

export const createSchool = async (schoolData) => {
  const existingSchool = await School.findOne({ where: { email: schoolData.email } });
  if (existingSchool) {
    throw new AppError('School with this email already exists', 400);
  }

  return await School.create(schoolData);
};

export const getAllSchools = async () => {
  return await School.findAll();
};

export const getSchoolById = async (id) => {
  const school = await School.findByPk(id);
  if (!school) {
    throw new AppError('School not found', 404);
  }
  return school;
};

export const updateSchool = async (id, schoolData) => {
  const school = await School.findByPk(id);
  if (!school) {
    throw new AppError('School not found', 404);
  }

  if (schoolData.email && schoolData.email !== school.email) {
    const existingEmail = await School.findOne({ where: { email: schoolData.email } });
    if (existingEmail) {
      throw new AppError('Another school already uses this email', 400);
    }
  }

  return await school.update(schoolData);
};

export const deleteSchool = async (id) => {
  const school = await School.findByPk(id);
  if (!school) {
    throw new AppError('School not found', 404);
  }
  await school.destroy();
  return true;
};
