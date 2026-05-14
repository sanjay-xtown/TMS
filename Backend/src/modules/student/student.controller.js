import Student from './student.model.js';

export const create = async (req, res) => {
    try {
        const student = await Student.create({
            ...req.body,
            schoolId: req.user.schoolId
        });
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const students = await Student.findAll({ where: { schoolId: req.user.schoolId } });
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const student = await Student.findOne({ 
            where: { id: req.params.id, schoolId: req.user.schoolId } 
        });
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        await student.destroy();
        res.status(200).json({ success: true, message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const assignBus = async (req, res) => {
    try {
        const { busId } = req.body;
        const student = await Student.findOne({ 
            where: { id: req.params.id, schoolId: req.user.schoolId } 
        });
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        await student.update({ busId });
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOne = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
