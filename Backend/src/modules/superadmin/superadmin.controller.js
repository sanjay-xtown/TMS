import SuperAdminService from './superadmin.service.js';

export const register = async (req, res) => {
  try {
    const admin = await SuperAdminService.register(req.body);
    res.status(201).json({ success: true, message: "SuperAdmin registered", data: admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await SuperAdminService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await SuperAdminService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
