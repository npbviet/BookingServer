const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// 📌 Import các routers
const clientAuthRoutes = require("./routes/client/auth.routes");
const clientGetDataRoutes = require("./routes/client/getData.routes");
const clientSetDataRoutes = require("./routes/client/setData.routes");

const adminAuthRoutes = require("./routes/admin/auth.routes");
const adminGetDataRoutes = require("./routes/admin/getData.routes");
const adminSetDataRoutes = require("./routes/admin/setData.routes");

// 📌 Kết nối MongoDB
const MONGODB_URL =
  "mongodb+srv://npbviet:Nbvnbv123@cluster0.2pfarzs.mongodb.net/booking";

// 📌 Tạo session store dùng MongoDB
const sessionStore = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});
sessionStore.on("error", (error) => {
  console.error("Session store error:", error);
});

// 📌 Cấu hình CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// 📌 Middleware cần thiết
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 📌 Cấu hình session (áp dụng toàn bộ server)
app.use(
  session({
    secret: "secretSession",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true, // 🔐 bảo mật cookie
      secure: false, // 👉 đặt true nếu dùng HTTPS thật
      sameSite: "lax", // 👉 nếu frontend khác domain thì dùng "none"
      maxAge: 2 * 60 * 60 * 1000, // 2 giờ
    },
  })
);

// 📌 Gắn các routers
app.use("/client/auth", clientAuthRoutes);
app.use("/client/getData", clientGetDataRoutes);
app.use("/client/setData", clientSetDataRoutes);

app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/getData", adminGetDataRoutes);
app.use("/admin/setData", adminSetDataRoutes);

// 📌 Kết nối DB và khởi động server
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log("🚀 Server is running on port 5000!");
    });
  })
  .catch((err) => console.log("⚠️ Error connecting to database:", err));
