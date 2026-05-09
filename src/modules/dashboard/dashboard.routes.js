import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// A. SUPER_ADMIN only route
router.get("/admin/dashboard", verifyToken, authorizeRoles("SUPER_ADMIN"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the SUPER_ADMIN Dashboard",
    user: req.user,
  });
});

// B. SCHOOL_ADMIN only route
router.get("/school/dashboard", verifyToken, authorizeRoles("SCHOOL_ADMIN"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the SCHOOL_ADMIN Dashboard",
    user: req.user,
  });
});

// C. DRIVER only route
router.get("/driver/dashboard", verifyToken, authorizeRoles("DRIVER"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the DRIVER Dashboard",
    user: req.user,
  });
});

// D. PARENT only route
router.get("/parent/dashboard", verifyToken, authorizeRoles("PARENT"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the PARENT Dashboard",
    user: req.user,
  });
});

export default router;
