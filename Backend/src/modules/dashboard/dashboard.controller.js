import * as dashboardService from './dashboard.service.js';

export const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getParentDashboardData(req.user.id);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getSuperAdminStats = async (req, res, next) => {
  try {
    const data = await dashboardService.getSuperAdminStats();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolAdminStats = async (req, res, next) => {
  try {
    // req.user.schoolId comes from authMiddleware/JWT for school_admin
    const data = await dashboardService.getSchoolAdminStats(req.user.schoolId);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};
