import * as authService from './auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginAdmin(email, password);
    
    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
