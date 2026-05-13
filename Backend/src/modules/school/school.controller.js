import { School } from './school.model.js';
import User from '../user/user.model.js';

export const createSchool = async (req, res, next) => {
  try {
    const { name, address, city, phone, logo } = req.body;
    const adminId = req.user.id;

    // 1. Create the school
    const school = await School.create({
      name,
      address,
      city,
      phone,
      logo,
      createdBy: adminId
    });

    // 2. Update the admin user with the schoolId
    await User.update(
      { schoolId: school.id },
      { where: { id: adminId } }
    );

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      school: school,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySchool = async (req, res) => {
    try {
        const school = await School.findOne({ 
            where: { createdBy: req.user.id } 
        });
        if (!school) return res.status(404).json({ success: false, message: "School not found" });
        res.status(200).json({ success: true, data: school });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
