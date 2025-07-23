const express = require("express");
const router = express.Router();
const getDataController = require("../../controllers/getData");
const { checkAuthen } = require("../../middleware/CheckAuthen");

// 📌 Lấy dữ liệu khách sạn
router.get("/get-hotel-data", getDataController.getHotelData);

// 📌 Tìm kiếm khách sạn (cần xác thực trước)
router.post(
  "/search-hotel",
  checkAuthen,
  getDataController.getDataForSearching
);

// 📌 Xem chi tiết khách sạn (cần xác thực trước)
router.post("/details-hotel", checkAuthen, getDataController.getHotelDetails);

// 📌 Xem lịch sử giao dịch của người dùng (cần xác thực trước)
router.post(
  "/transactions",
  checkAuthen,
  getDataController.getTransactionDataByEmail
);

module.exports = router;
