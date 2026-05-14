import { Parent, Student, Bus, School } from '../../models/initModels.js';
import { comparePassword, hashPassword } from '../../shared/auth/bcrypt.js';
import { generateToken } from '../../shared/auth/jwt.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

/**
 * Parent Login
 */
export const loginParent = async (mobileNumber, password) => {
  console.log(`[AUTH] Login attempt for mobile: ${mobileNumber}`);
  const parent = await Parent.findOne({ where: { mobileNumber } });

  if (!parent || !(await comparePassword(password, parent.password))) {
    console.warn(`[AUTH] Login failed for mobile: ${mobileNumber}`);
    throw new AppError('Invalid mobile number or password', 401);
  }

  console.log(`[AUTH] Login successful for Parent: ${parent.parentName} (ID: ${parent.id})`);
  
  const token = generateToken({ 
    id: parent.id, 
    role: 'parent', 
    mobileNumber: parent.mobileNumber 
  });

  const { password: _, ...parentData } = parent.toJSON();
  return { parent: parentData, token };
};

/**
 * Get Parent Dashboard Data (Profile)
 * Fetches parent info along with their children (students) and bus assignments
 */
export const getParentProfile = async (id) => {
  console.log(`[PROFILE] Fetching data for Parent ID: ${id}`);
  
  const parent = await Parent.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Student,
        as: 'children',
        attributes: [
          'id', 
          'studentName', 
          'class', 
          'section', 
          'gender', 
          'pickupPoint', 
          'currentBusId'
        ],
        include: [
          { 
            model: Bus, 
            as: 'bus', 
            attributes: ['id', 'busNumber', 'busRegisterNumber', 'driverName', 'driverMobileNumber', 'capacity'] 
          },
          { model: School, as: 'school', attributes: ['id', 'schoolName', 'longitude'] }
        ]
      }
    ]
  });

  if (!parent) {
    console.error(`[PROFILE] Parent not found for ID: ${id}`);
    throw new AppError('Parent Profile Not Found in Database', 404);
  }

  return parent;
};

/**
 * Update Parent details
 */
export const updateParent = async (id, updateData) => {
  const parent = await Parent.findByPk(id);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  
  // Hash password if it's being updated
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  return await parent.update(updateData);
};

/**
 * Update Parent FCM Token
 */
export const updateFcmToken = async (id, fcmToken) => {
  const parent = await Parent.findByPk(id);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  
  return await parent.update({ fcmToken });
};

/**
 * Get all parents (Admin) - Only returns parents with active students
 */
export const getAllParents = async () => {
  const results = await Parent.findAll({
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Student,
        as: 'children',
        attributes: ['id', 'studentName', 'class', 'section', 'rollNo'],
        required: true 
      }
    ]
  });
  return results;
};

/**
 * Delete Parent (Admin)
 */
export const deleteParent = async (id) => {
  const parent = await Parent.findByPk(id);
  if (!parent) {
    throw new AppError('Parent not found', 404);
  }
  
  // Also delete linked students to maintain integrity if manually deleting a parent
  await Student.destroy({ where: { parentId: id } });
  await parent.destroy();
  
  return { message: 'Parent and linked students deleted successfully' };
};
