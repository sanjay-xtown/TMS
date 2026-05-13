import Bus from './bus.model.js';

export const create = async (req, res) => {
    try {
        const bus = await Bus.create({
            ...req.body,
            schoolId: req.user.schoolId
        });
        res.status(201).json({ success: true, data: bus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const buses = await Bus.findAll({ where: { schoolId: req.user.schoolId } });
        res.status(200).json({ success: true, data: buses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
