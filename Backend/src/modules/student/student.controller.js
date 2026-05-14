import * as studentService from './student.service.js';
import { createStudentSchema, updateStudentSchema } from './student.schema.js';
import School from '../school/school.model.js';

export const create = async (req, res, next) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);
    
    // Automatically take schoolId from the logged-in admin if not provided
    if (!validatedData.schoolId && req.user?.schoolId) {
      validatedData.schoolId = req.user.schoolId;
    }

    // Final check to ensure we have a schoolId
    if (!validatedData.schoolId) {
      return res.status(400).json({
        status: 'fail',
        message: 'School ID is required. Admins without a linked school must provide one.'
      });
    }

    // VERIFY: Check if school exists to avoid FK error
    const schoolExists = await School.findByPk(validatedData.schoolId);
    if (!schoolExists) {
      return res.status(404).json({
        status: 'fail',
        message: `School with ID ${validatedData.schoolId} not found in the system. Please contact superadmin.`
      });
    }

    const result = await studentService.createStudentWithParent(validatedData);
    res.status(201).json({
      status: 'success',
      message: 'Student and Parent processed successfully',
      data: result,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        status: 'fail',
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const validatedData = updateStudentSchema.parse(req.body);
    const student = await studentService.updateStudent(req.params.id, validatedData);
    res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    
    // If the requester is a parent, only show their own children
    if (req.user?.role === 'parent') {
      filters.parentId = req.user.id;
    } else if (req.user?.role === 'school_admin' && req.user?.schoolId) {
      // If school admin, only show their school's students
      filters.schoolId = req.user.schoolId;
    }

    const students = await studentService.getStudents(filters);
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

export const assignBusToStudent = async (req, res, next) => {
  try {
    const { busId } = req.body;
    const student = await studentService.assignBus(req.params.id, busId);
    res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a photo to upload'
      });
    }

    const photoUrl = `/uploads/students/${req.file.filename}`;
    const student = await studentService.updateStudentPhoto(req.params.id, photoUrl);

    res.status(200).json({
      status: 'success',
      message: 'Profile photo uploaded successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};
