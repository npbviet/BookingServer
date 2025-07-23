const express = require("express");
const router = express.Router();
const setDataController = require("../../controllers/setData");
const { checkAuthen } = require("../../middleware/CheckAuthen");

// 📌 Đặt phòng - Lưu thông tin giao dịch vào hệ thống (cần xác thực)
router.post("/booking", checkAuthen, setDataController.postBookingData);

module.exports = router;
