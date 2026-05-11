import * as studentService from './student.service.js';
import { createStudentSchema, updateStudentSchema } from './student.schema.js';

export const create = async (req, res, next) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);
    
    // Auto-inject schoolId if it's not in the body but available in the user session
    if (!validatedData.schoolId && req.user && req.user.schoolId) {
      validatedData.schoolId = req.user.schoolId;
    }

    const result = await studentService.createStudentWithParent(validatedData);
    res.status(201).json({
      status: 'success',
      message: 'Student and Parent processed successfully',
      data: result,
    });
  } catch (error) {
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
    const students = await studentService.getStudents(req.query);
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
