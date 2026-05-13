import SettingsService from './settings.service.js';

export const getAll = async (req, res) => {
  try {
    const settings = await SettingsService.getAll();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const add = async (req, res) => {
  try {
    const setting = await SettingsService.addOrUpdate(req.body.key, req.body.value);
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const setting = await SettingsService.addOrUpdate(req.body.key, req.body.value);
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await SettingsService.delete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
