const bcrypt = require("bcryptjs");
const User = require("../models/user");

// 📌 Lấy thông tin người dùng đang đăng nhập
exports.getActiveUserInfor = async (req, res, next) => {
  try {
    if (!req.session || !req.session.isLoggedIn) {
      console.log("🔎 Session lỗi:", req.session);
      return res.status(401).json({
        message: "❌ Bạn chưa đăng nhập!",
        session: { isLoggedIn: false },
        user: null,
      });
    }

    return res.status(200).json({
      message: "✅ Đã đăng nhập",
      session: {
        isLoggedIn: true,
        user: req.session.user || null,
      },
    });
  } catch (error) {
    console.error("⚠️ Lỗi khi lấy thông tin người dùng:", error);
    return res.status(500).json({ message: "❌ Đã xảy ra lỗi!" });
  }
};

// 📌 Xử lý đăng nhập
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "❌ Email không tồn tại, vui lòng kiểm tra lại!",
        isAuthError: true,
      });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(401).json({
        message: "❌ Email hoặc mật khẩu không chính xác!",
        isAuthError: true,
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    return res.status(200).json({
      message: "✅ Đăng nhập thành công!",
      isAuthError: false,
      email: user.email,
    });
  } catch (error) {
    console.error("⚠️ Lỗi khi đăng nhập:", error);
    return res.status(500).json({ message: "❌ Đã xảy ra lỗi!" });
  }
};

// 📌 Xử lý đăng ký tài khoản mới
exports.postSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "⚠️ Email đã tồn tại, vui lòng sử dụng email khác!",
        isAuthError: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // ❌ Không tạo session, không đăng nhập tự động

    return res.status(201).json({
      message: "✅ Đăng ký thành công! Vui lòng đăng nhập.",
      isAuthError: false,
    });
  } catch (error) {
    console.error("⚠️ Lỗi khi đăng ký:", error);
    return res.status(500).json({ message: "❌ Đã xảy ra lỗi!" });
  }
};

// 📌 Xử lý đăng xuất
exports.getLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    return res.status(200).json({ message: "✅ Đăng xuất thành công!" });
  } catch (error) {
    console.error("⚠️ Lỗi khi đăng xuất:", error);
    return res.status(500).json({ message: "❌ Đã xảy ra lỗi!" });
  }
};

// 📌 Đăng nhập Admin
exports.postLoginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "❌ Email không tồn tại!",
        isAuthError: true,
      });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(401).json({
        message: "❌ Email hoặc mật khẩu không chính xác!",
        isAuthError: true,
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: "⛔ Bạn không có quyền truy cập trang admin!",
        isAuthError: true,
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();

    return res
      .status(200)
      .json({ message: "✅ Đăng nhập Admin thành công!", isAuthError: false });
  } catch (error) {
    console.error("⚠️ Lỗi khi đăng nhập Admin:", error);
    return res.status(500).json({ message: "❌ Đã xảy ra lỗi!" });
  }
};
