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
