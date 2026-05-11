import { School } from "./school.model.js";

// CREATE SCHOOL
export const createSchool = async (req, res) => {
  try {
    const { schoolName, address, phone, email, principalName, latitude, longitude } = req.body;

    // Check if school email already exists
    const existingSchool = await School.findOne({ where: { email } });
    if (existingSchool) {
      return res.status(400).json({ message: "School with this email already exists" });
    }

    const school = await School.create({
      schoolName,
      address,
      phone,
      email,
      principalName,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: "School created successfully",
      school,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating school", error: error.message });
  }
};

// GET ALL SCHOOLS
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.status(200).json({
      message: "Schools retrieved successfully",
      count: schools.length,
      schools,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error: error.message });
  }
};

// GET SCHOOL BY ID
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByPk(id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "School retrieved successfully",
      school,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching school", error: error.message });
  }
};

// UPDATE SCHOOL
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolName, address, phone, email, principalName, latitude, longitude } = req.body;

    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // If updating email, check if new email already exists in another school
    if (email && email !== school.email) {
      const existingEmail = await School.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Another school already uses this email" });
      }
    }

    await school.update({
      schoolName: schoolName || school.schoolName,
      address: address || school.address,
      phone: phone || school.phone,
      email: email || school.email,
      principalName: principalName || school.principalName,
      latitude: latitude !== undefined ? latitude : school.latitude,
      longitude: longitude !== undefined ? longitude : school.longitude,
    });

    res.status(200).json({
      message: "School updated successfully",
      school,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating school", error: error.message });
  }
};

// DELETE SCHOOL
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByPk(id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    await school.destroy();

    res.status(200).json({
      message: "School deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting school", error: error.message });
  }
};
