import * as parentService from './parent.service.js';
import { parentLoginSchema } from './parent.schema.js';

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
