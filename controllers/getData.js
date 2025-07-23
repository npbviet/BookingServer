const Hotel = require("../models/hotel");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Room = require("../models/room");

// 📌 Lấy danh sách khách sạn
exports.getHotelData = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách khách sạn:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};
// 📌 Tìm kiếm khách sạn
exports.getDataForSearching = async (req, res, next) => {
  try {
    const {
      city,
      totalPeople,
      roomQuantity,
      dateStart,
      dateEnd,
      minPrice,
      maxPrice,
    } = req.body;

    if (!city || !totalPeople || !roomQuantity || !dateStart || !dateEnd) {
      return res
        .status(400)
        .json({ message: "Missing required search parameters." });
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    // 1. Tìm các giao dịch trùng ngày
    const conflictingTransactions = await Transaction.find({
      dateStart: { $lte: end },
      dateEnd: { $gte: start },
    });

    // 2. Lưu phòng đã đặt
    const bookedMap = new Map();
    conflictingTransactions.forEach((tx) => {
      tx.rooms.forEach((room) => {
        const roomID = room.roomID.toString();

        if (!bookedMap.has(roomID)) {
          bookedMap.set(roomID, new Set());
        }
        room.roomOrder.forEach((order) => {
          bookedMap.get(roomID).add(order);
        });
      });
    });
    // 3. Lấy danh sách khách sạn
    const hotels = await Hotel.find({ city }).populate("rooms");

    // 4. Lọc khách sạn còn phòng phù hợp
    const availableHotels = hotels.reduce((acc, hotel) => {
      const availableRoomDetails = hotel.rooms.flatMap((room) => {
        const roomID = room._id.toString();
        const bookedNumbers = bookedMap.get(roomID) || new Set();

        const withinPriceRange =
          (minPrice == null || room.price >= minPrice) &&
          (maxPrice == null || room.price <= maxPrice);

        if (!withinPriceRange) return [];

        return room.roomNumbers
          .filter((num) => !bookedNumbers.has(num.toString()))
          .map((num) => ({
            roomID: room._id,
            desc: room.desc,
            title: room.title,
            maxPeople: room.maxPeople,
            price: room.price,
            roomNumber: num,
          }));
      });

      if (availableRoomDetails.length < roomQuantity) return acc;

      const suggestedRooms = availableRoomDetails
        .sort((a, b) => b.maxPeople - a.maxPeople)
        .slice(0, roomQuantity);

      const totalCapacity = suggestedRooms.reduce(
        (sum, room) => sum + room.maxPeople,
        0
      );

      if (totalCapacity < totalPeople) return acc;

      acc.push({
        ...hotel.toObject(),
        allAvailableRooms: availableRoomDetails,
      });

      return acc;
    }, []);

    res.json({ availableHotels });
  } catch (err) {
    console.error("Error in getDataForSearching:", err);
    res.status(500).json({ message: "Server error when searching hotels" });
  }
};

// 📌 Lấy thông tin khách sạn theo ID
exports.getHotelDetails = async (req, res, next) => {
  try {
    const hotelID = req.body.hotelID;
    const hotel = await Hotel.findById(hotelID).populate("rooms");

    if (!hotel) {
      return res.status(404).json({ message: "⚠️ Khách sạn không tồn tại!" });
    }

    return res.status(200).json(hotel);
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin khách sạn:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};

// 📌 Lấy thông tin phòng theo ID
exports.getRoomByID = async (req, res, next) => {
  try {
    const roomID = req.body.roomID;
    const room = await Room.findById(roomID);

    if (!room) {
      return res.status(404).json({ message: "⚠️ Phòng không tồn tại!" });
    }

    return res.status(200).json(room);
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin phòng:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};

// 📌 Lấy danh sách giao dịch của khách hàng theo email
exports.getTransactionDataByEmail = async (req, res, next) => {
  try {
    const userEmail = req.body.userEmail;
    const transactions = await Transaction.find({
      "user.email": userEmail,
    })
      .populate("hotel", "name-_id")
      .sort({ dateStart: 1 });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu giao dịch:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};

// 📌 Lấy danh sách tất cả người dùng (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};

// 📌 Lấy danh sách tất cả phòng (Admin)
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};

// 📌 Lấy danh sách giao dịch (Admin)
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().populate("hotel", "name-_id");

    // 📌 Sắp xếp theo ngày đặt gần nhất
    transactions.sort((a, b) => b.dateStart - a.dateStart);

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách giao dịch:", error);
    return res.status(500).json({ message: "⚠️ Đã xảy ra lỗi!" });
  }
};
