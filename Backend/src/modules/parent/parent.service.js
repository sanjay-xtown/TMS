import Parent from './parent.model.js';
import Student from '../student/student.model.js';
import { comparePassword } from '../../shared/auth/bcrypt.js';
import { generateToken } from '../../shared/auth/jwt.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

/**
 * Parent Login
 */
export const loginParent = async (mobileNumber, password) => {
  const parent = await Parent.findOne({ where: { mobileNumber } });

  if (!parent || !(await comparePassword(password, parent.password))) {
    throw new AppError('Invalid mobile number or password', 401);
  }

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
        ]
      }
    ]
  });

  if (!parent) {
    throw new AppError('Parent not found', 404);
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
