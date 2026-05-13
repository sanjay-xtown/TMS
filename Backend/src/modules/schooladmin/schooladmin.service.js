import SchoolAdmin from './schooladmin.model.js';
import WhatsAppService from './whatsapp.service.js';

class SchoolAdminService {
  async create(data) {
    try {
      // 1. Check if admin already exists
      const existing = await SchoolAdmin.findOne({ where: { adminEmail: data.adminEmail } });
      if (existing) throw new Error("Email already registered");

      // 2. Create Admin in DB
      const admin = await SchoolAdmin.create({
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        password: data.password,
        schoolName: data.schoolName,
        schoolLocation: data.schoolLocation,
        whatsappNumber: data.whatsappNumber
      });

      // 3. Send WhatsApp Invitation
      await WhatsAppService.sendInvitation(
        data.adminName,
        data.schoolName,
        data.adminEmail,
        data.password,
        data.whatsappNumber
      );

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return await SchoolAdmin.findAll({
        attributes: { exclude: ['password'] }
      });
    } catch (error) {
      throw new Error("Failed to fetch admins: " + error.message);
    }
  }

  async update(id, data) {
    try {
      const admin = await SchoolAdmin.findByPk(id);
      if (!admin) throw new Error("Admin not found");

      return await admin.update(data);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const admin = await SchoolAdmin.findByPk(id);
      if (!admin) throw new Error("Admin not found");

      await admin.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new SchoolAdminService();
