exports.checkAuthen = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.status(401).json({
      status: "error",
      message: "⛔ Không có quyền truy cập. Vui lòng đăng nhập!",
    });
  }
  next();
};
