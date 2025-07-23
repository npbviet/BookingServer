const express = require("express");
const router = express.Router();
const getDataController = require("../../controllers/getData");

// 📌 Lấy danh sách tất cả người dùng
router.get("/get-users", getDataController.getAllUsers);

// 📌 Lấy danh sách tất cả khách sạn
router.get("/get-all-hotels", getDataController.getHotelData);

// 📌 Lấy thông tin chi tiết của một khách sạn
router.post("/get-hotel", getDataController.getHotelDetails);

// 📌 Lấy danh sách tất cả phòng trong hệ thống
router.get("/get-rooms", getDataController.getAllRooms);

// 📌 Lấy thông tin chi tiết của một phòng
router.post("/get-room-infor", getDataController.getRoomByID);

// 📌 Lấy danh sách tất cả giao dịch
router.get("/get-alltransactions", getDataController.getAllTransactions);

module.exports = router;
