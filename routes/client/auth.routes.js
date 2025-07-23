const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth");

// 📌 Kiểm tra thông tin đăng nhập của người dùng đang hoạt động
router.get("/getActiveUserInfor", authController.getActiveUserInfor);

// 📌 Đăng nhập vào hệ thống
router.post("/login", authController.postLogin);

// 📌 Đăng ký tài khoản mới
router.post("/signup", authController.postSignup);

// 📌 Đăng xuất khỏi hệ thống
router.get("/logout", authController.getLogout);

module.exports = router;
