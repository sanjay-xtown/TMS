import * as parentService from './parent.service.js';
import { parentLoginSchema } from './parent.schema.js';
import Parent from './parent.model.js';

// Mock WhatsApp Service
const sendWhatsAppMessage = async (phone, message) => {
    console.log(`[WhatsApp API] Sending to ${phone}: ${message}`);
    return true;
};

export const login = async (req, res, next) => {
  try {
    const { mobileNumber, password } = parentLoginSchema.parse(req.body);
    const data = await parentService.loginParent(mobileNumber, password);


    res.status(200).json({
      status: 'success',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    // req.user.id comes from authMiddleware
    const parent = await parentService.getParentProfile(req.user.id);
    res.status(200).json({
      status: 'success',
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const parent = await parentService.updateParent(req.user.id, req.body);
    res.status(200).json({
      status: 'success',
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateParent = async (req, res, next) => {
  try {
    const parent = await parentService.updateParent(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: parent,
    });
  } catch (error) {
    next(error);
  }
};

export const createParent = async (req, res) => {
    try {
        // Accept either camelCase or snake_case field names from the frontend
        const parentName = req.body.parent_name || req.body.parentName;
        const mobileNumberRaw = req.body.phone || req.body.mobileNumber;
        const { address } = req.body;

        // ----------- Basic validation -----------
        if (!parentName || typeof parentName !== 'string' || !parentName.trim()) {
            return res.status(400).json({ success: false, message: 'Parent name is required.' });
        }
        if (!mobileNumberRaw || typeof mobileNumberRaw !== 'string') {
            return res.status(400).json({ success: false, message: 'Phone number is required.' });
        }
        // Strip non‑digit characters
        const digitsOnly = mobileNumberRaw.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return res.status(400).json({ success: false, message: 'Phone number must contain at least 10 digits.' });
        }
        // Ensure schoolId is available from auth middleware
        const schoolId = req.user && req.user.schoolId;
        if (!schoolId) {
            return res.status(400).json({ success: false, message: 'School ID missing in request.' });
        }

        // ----------- Auto‑generate password (last 4 digits) -----------
        const autoPassword = digitsOnly.slice(-4);

        const payload = {
            parentName: parentName.trim(),
            mobileNumber: digitsOnly,
            password: autoPassword, // will be bcrypt‑hashed by model hook
            schoolId,
            address: address || null,
        };

        const parent = await Parent.create(payload);
        // Remove password hash from response
        const { password: _omit, ...safeParent } = parent.toJSON();
        res.status(201).json({
            success: true,
            message: 'Parent created successfully. Password is the last 4 digits of the mobile number.',
            data: safeParent,
        });
    } catch (error) {
        console.error('createParent error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({ where: { schoolId: req.user.schoolId } });
        res.status(200).json({ success: true, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const parent = await Parent.findOne({ 
            where: { id: req.params.id, schoolId: req.user.schoolId } 
        });
        if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });

        await parent.destroy();
        res.status(200).json({ success: true, message: "Parent deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendInvitation = async (req, res) => {
    try {
        const { parentId } = req.body;
        const parent = await Parent.findByPk(parentId);

        if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });

        // Derive the password hint from the stored mobile number (last 4 digits)
        const digitsOnly = (parent.mobileNumber || '').replace(/\D/g, '');
        const passwordHint = digitsOnly.slice(-4) || '****';

        const message = `Hello ${parent.parentName} 👋\n\nYou have been registered in the School Transport System.\n\nLogin Details:\nUsername (Mobile): ${parent.mobileNumber}\nPassword: ${passwordHint} (last 4 digits of your mobile number)\n\nLink: https://yourapp.com/login\n\n- School Transport Team`;

        await sendWhatsAppMessage(parent.mobileNumber, message);
        await parent.update({ invitationSent: true });

        res.status(200).json({ success: true, message: "Invitation sent successfully" });
    } catch (error) {
        console.error('sendInvitation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
