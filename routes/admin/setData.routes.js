const express = require("express");
const router = express.Router();
const setDataController = require("../../controllers/setData");
const { checkAuthen } = require("../../middleware/CheckAuthen");

// 📌 Xóa khách sạn khỏi hệ thống (cần xác thực)
router.post("/delete-hotel", checkAuthen, setDataController.postDeleteHotel);

// 📌 Thêm khách sạn mới vào hệ thống (cần xác thực)
router.post("/add-new-hotel", checkAuthen, setDataController.postAddNewHotel);

// 📌 Chỉnh sửa thông tin khách sạn (cần xác thực)
router.post("/edit-hotel", checkAuthen, setDataController.postEditHotel);

// 📌 Xóa phòng khỏi hệ thống (cần xác thực)
router.post("/delete-room", checkAuthen, setDataController.postDeleteRoom);

// 📌 Thêm phòng mới vào hệ thống (cần xác thực)
router.post("/add-new-room", checkAuthen, setDataController.postAddNewRoom);

// 📌 Chỉnh sửa thông tin phòng (cần xác thực)
router.post("/edit-room", checkAuthen, setDataController.postEditRoom);

module.exports = router;
