import express from "express";
import { signup, login } from "./auth.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

export default router;