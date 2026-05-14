import * as transferService from './transfer.service.js';
import { transferStudentSchema, emergencyTransferSchema } from './transfer.schema.js';

export const getTransfers = async (req, res, next) => {
  try {
    const transfers = await transferService.getAllTransfers();
    res.status(200).json({
      status: 'success',
      data: transfers,
    });
  } catch (error) {
    next(error);
  }
};

export const transferStudent = async (req, res, next) => {
  try {
    const validatedData = transferStudentSchema.parse(req.body);
    // If admin is logged in, use their ID
    const updatedBy = req.user?.id || validatedData.updatedBy;
    
    const result = await transferService.transferStudent({ ...validatedData, updatedBy });
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const emergencyTransfer = async (req, res, next) => {
  try {
    const validatedData = emergencyTransferSchema.parse(req.body);
    const result = await transferService.emergencyTransfer(validatedData);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
