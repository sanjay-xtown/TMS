import { Parent, Student, School, Bus } from '../../models/initModels.js';
import { hashPassword } from '../../shared/auth/bcrypt.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import { Op } from 'sequelize';

/**
 * Create Student with Parent details (New Flow)
 * 1. Checks if parent exists by email or mobileNumber
 * 2. Creates parent if not exists
 * 3. Creates student and links to parent
 */
export const createStudentWithParent = async (data) => {
  const { parent: parentData, ...studentData } = data;

  // 1. Check if parent already exists
  let parent = await Parent.findOne({
    where: {
      [Op.or]: [
        { email: parentData.email },
        { mobileNumber: parentData.mobileNumber }
      ]
    }
  });

  // 2. If parent doesn't exist, create one
  if (!parent) {
    const hashedPassword = await hashPassword(parentData.password);
    parent = await Parent.create({
      ...parentData,
      password: hashedPassword
    });

    // SIMULATE WHATSAPP NOTIFICATION
    console.log('\n--- WhatsApp Notification Simulation ---');
    console.log(`To: ${parent.mobileNumber}`);
    console.log('Message:');
    console.log(`Welcome to School Bus Tracking App\n\nYour parent account has been created successfully.\n\nEmail: ${parent.email}\nPassword: ${parentData.password}\n\nDownload App:\nhttps://schoolbusapp.com/download`);
    console.log('----------------------------------------\n');
  }

  // 3. Create Student and link to parentId
  const student = await Student.create({
    ...studentData,
    parentId: parent.id
  });

  return {
    student,
    parent: {
      id: parent.id,
      parentName: parent.parentName,
      email: parent.email,
      mobileNumber: parent.mobileNumber
    }
  };
};

export const updateStudent = async (id, updateData) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return await student.update(updateData);
};

export const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const parentId = student.parentId;

  // Destroy the student
  await student.destroy();

  // If a parentId exists, check if they have other students
  if (parentId) {
    const otherStudentsCount = await Student.count({ where: { parentId } });
    if (otherStudentsCount === 0) {
      // No other students linked, safe to clean up the parent record
      await Parent.destroy({ where: { id: parentId } });
      console.log(`[CLEANUP] Parent ${parentId} removed as they have no remaining students.`);
    }
  }

  return { message: 'Student and orphaned parent (if any) deleted successfully' };
};

export const getStudents = async (filters = {}) => {
  return await Student.findAll({ 
    where: filters,
    include: [{ model: Parent, as: 'parent', attributes: ['id', 'parentName', 'mobileNumber', 'email'] }]
  });
};

export const assignBus = async (studentId, busId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return await student.update({ currentBusId: busId });
};

export const updateStudentPhoto = async (id, photoUrl) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error('Student not found');
  student.profilePhoto = photoUrl;
  await student.save();
  return student;
};

export const getStudentById = async (id) => {
  return await Student.findByPk(id, {
    include: [
      { model: Parent, as: 'parent', attributes: ['parentName', 'phone', 'email'] },
      { model: Bus, as: 'bus', attributes: ['busNumber', 'busRegisterNumber', 'routeName'] }
    ]
  });
};
