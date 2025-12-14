const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authValidation } = require("../middlewares/validationMiddleware");

const router = express.Router();

/**
 * @post /auth/register
 * Register a new user
 */
router.post("/register", authValidation.register, register);

/**
 * @post /auth/login
 * Login user
 */
router.post("/login", authValidation.login, login);

/**
 * @post /auth/refresh
 * Refresh access token
 */
router.post("/refresh", authValidation.refresh, refresh);

/**
 * @post /auth/logout
 * Logout user
 */
router.post("/logout", authValidation.logout, logout);

/**
 * @get /auth/me
 * Get current user (requires authentication)
 */
router.get("/me", verifyToken, getMe);

module.exports = router;
