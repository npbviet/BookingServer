const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth");

// 📌 Kiểm tra thông tin đăng nhập của Admin đang hoạt động
router.get("/getActiveUserInfor", authController.getActiveUserInfor);

// 📌 Đăng nhập với quyền Admin
router.post("/login", authController.postLoginAdmin);

// 📌 Đăng xuất khỏi hệ thống
router.get("/logout", authController.getLogout);

module.exports = router;
