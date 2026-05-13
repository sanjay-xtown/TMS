import Setting from './settings.model.js';

class SettingsService {
  async getAll() {
    return await Setting.findAll();
  }

  async addOrUpdate(key, value) {
    let setting = await Setting.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }
    return setting;
  }

  async delete(id) {
    const setting = await Setting.findByPk(id);
    if (!setting) throw new Error("Setting not found");
    await setting.destroy();
    return true;
  }
}

export default new SettingsService();
