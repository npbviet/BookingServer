require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretString = process.env.jwtString; // 📌 Lấy secret từ biến môi trường

// 📌 Tạo JWT token (mã hóa)
const createJWTToken = (payloadData, expiresIn = "2h") => {
  let jwtToken = null;
  try {
    jwtToken = jwt.sign(payloadData, secretString, { expiresIn });
    return jwtToken;
  } catch (error) {
    console.error("⚠️ Lỗi khi tạo JWT Token:", error);
    return null;
  }
};

// 📌 Xác thực và giải mã JWT token
const verifyJWTToken = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, secretString);
    console.log("✅ Token hợp lệ. Dữ liệu giải mã:", decoded);
  } catch (error) {
    console.error("❌ Token không hợp lệ hoặc đã hết hạn:", error.message);
  }
  return decoded;
};

module.exports = {
  createJWTToken,
  verifyJWTToken,
};
