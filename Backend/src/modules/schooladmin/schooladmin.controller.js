import SchoolAdminService from './schooladmin.service.js';

export const create = async (req, res) => {
  try {
    const { schoolName, schoolLocation, adminName, adminEmail, password, whatsappNumber } = req.body;

    if (!schoolName || !schoolLocation || !adminName || !adminEmail || !password || !whatsappNumber) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const admin = await SchoolAdminService.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Invitation sent successfully", 
      data: admin 
    });
  } catch (error) {
    // Return the specific error message (e.g. "Email already registered")
    console.error("Backend Create Error:", error.message);
    res.status(400).json({ 
      success: false, 
      message: error.message || "Failed to create school admin"
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await SchoolAdminService.getAll();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const result = await SchoolAdminService.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Updated successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await SchoolAdminService.delete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
