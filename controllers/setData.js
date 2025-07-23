const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");
const Room = require("../models/room");

// Tạo một hàm kiểm tra và xử lý lỗi đồng bộ
const handleError = (err, res, message) => {
  res.status(500).json({ message: message, error: err.message });
};

// Kiểm tra xem khách sạn đã được đặt chưa
const isHotelBooked = async (hotelID) => {
  try {
    const data = await Transaction.find({ hotel: hotelID });
    return data.length > 0;
  } catch (err) {
    throw new Error("Error while checking hotel booking status");
  }
};

// Kiểm tra xem phòng đã được đặt chưa
const isRoomBooked = async (roomID) => {
  try {
    const data = await Transaction.find({ "rooms.roomID": roomID });
    return data.length > 0;
  } catch (err) {
    throw new Error("Error while checking room booking status");
  }
};

// Action for booking
exports.postBookingData = async (req, res, next) => {
  try {
    const transaction = new Transaction(req.body.bookingInfor);
    await transaction.save();
    res.status(200).json({ message: "Transaction is successful!" });
  } catch (err) {
    handleError(err, res, "Error in booking transaction");
  }
};

// Action for delete hotel by hotelID
exports.postDeleteHotel = async (req, res, next) => {
  const hotelID = req.body.hotelID;

  try {
    if (await isHotelBooked(hotelID)) {
      return res.json({ message: "Hotel is booked" });
    }

    await Hotel.findByIdAndDelete(hotelID);
    res.json({ message: "Delete hotel is successful!" });
  } catch (err) {
    handleError(err, res, "Error in delete hotel by hotelID");
  }
};

// Action for add new hotel
exports.postAddNewHotel = async (req, res, next) => {
  const hotelData = req.body.hotelData;
  const hotel = new Hotel(hotelData);

  try {
    await hotel.save();
    res.status(200).json({ message: "Add new hotel process is successful!" });
  } catch (err) {
    handleError(err, res, "Error in add new hotel");
  }
};

// Action for edit hotel
exports.postEditHotel = async (req, res, next) => {
  const hotelData = req.body.hotelData;
  const hotelID = hotelData._id;

  try {
    const newHotelData = await Hotel.findByIdAndUpdate(
      hotelID,
      { $set: hotelData },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Edit hotel process is successful!" });
  } catch (err) {
    handleError(err, res, "Error in edit hotel");
  }
};

// Action for delete room by roomID
exports.postDeleteRoom = async (req, res, next) => {
  const roomID = req.body.roomID;

  try {
    if (await isRoomBooked(roomID)) {
      return res.json({ message: "Room is booked" });
    }

    await Room.findByIdAndDelete(roomID);

    const hotels = await Hotel.find({ rooms: roomID });
    const updatePromises = hotels.map(async (hotel) => {
      hotel.rooms = hotel.rooms.filter((roomId) => !roomId.equals(roomID));
      await hotel.save();
    });

    await Promise.all(updatePromises);
    res.json({ message: "Delete room is successful!" });
  } catch (err) {
    handleError(err, res, "Error in delete room by roomID");
  }
};

// Action for add new room
exports.postAddNewRoom = async (req, res, next) => {
  const hotelID = req.body.roomData.hotelID;
  const roomData = req.body.roomData.roomData;

  const room = new Room(roomData);

  try {
    await room.save();
    const newRoom = await Room.findOne().sort({ createdAt: -1 }).select("_id");

    const selectedHotel = await Hotel.findById(hotelID);
    selectedHotel.rooms.push(newRoom._id);
    await selectedHotel.save();

    res.status(200).json({ message: "Add new room process is successful!" });
  } catch (err) {
    handleError(err, res, "Error in add new room");
  }
};

// Action for edit room
exports.postEditRoom = async (req, res, next) => {
  const roomData = req.body.roomData;
  const roomID = roomData._id;

  try {
    const newRoomData = await Room.findByIdAndUpdate(
      roomID,
      { $set: roomData },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Edit room process is successful!" });
  } catch (err) {
    handleError(err, res, "Error in edit room");
  }
};
