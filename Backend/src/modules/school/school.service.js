import { School, Bus, Admin } from '../../models/initModels.js';
import sequelize from '../../config/db.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import { hashPassword } from '../../shared/auth/bcrypt.js';

export const createSchool = async (schoolData) => {
  const { adminName, adminEmail, adminPassword, ...rest } = schoolData;
  
  const existingSchool = await School.findOne({ where: { email: rest.email } });
  if (existingSchool) {
    throw new AppError('School with this email already exists', 400);
  }

  const result = await sequelize.transaction(async (t) => {
    const school = await School.create(rest, { transaction: t });

    if (adminName && adminEmail && adminPassword) {
      const hashedPassword = await hashPassword(adminPassword);
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'school_admin',
        schoolId: school.id
      }, { transaction: t });
    }

    return school;
  });

  return result;
};

export const getAllSchools = async () => {
  try {
    const schools = await School.findAll({
      include: [{
        model: Admin,
        as: 'admins',
        where: { role: 'school_admin' },
        required: false,
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`[SchoolService] Successfully retrieved ${schools.length} schools.`);
    return schools;
  } catch (error) {
    console.error("[SchoolService] Error retrieving schools:", error);
    throw error;
  }
};

export const getSchoolById = async (id) => {
  const school = await School.findByPk(id, {
    include: [{
      model: Admin,
      as: 'admins',
      attributes: ['id', 'name', 'email']
    }]
  });
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

export const toggleSchoolStatus = async (id) => {
  const school = await School.findByPk(id);
  if (!school) {
    throw new AppError('School not found', 404);
  }
  const newStatus = school.status === 'Active' ? 'Inactive' : 'Active';
  return await school.update({ status: newStatus });
};
