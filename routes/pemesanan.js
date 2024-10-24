// backend/routes/pemesanan.js
const express = require("express");
const { Op } = require("sequelize");

const {
  mustLogin,
  mustAdmin,
  mustReceptionist,
} = require("../middleware/auth");
const pelanggan = require("../models/index").pelanggan;
const pemesanan = require("../models/index").pemesanan;
const detail_pemesanan = require("../models/index").detail_pemesanan;
const kamar = require("../models/index").kamar;
const tipe_kamar = require("../models/index").tipe_kamar;
const cors = require("cors");

const app = express();
app.use(cors());

/**
 * @apiRoutes {get} /hotel/booking/
 * @apiName GetAllBooking
 * @apiGroup Booking
 * @apiDescription Get all booking data
 */
app.get(
  "/",
  // mustLogin,
  async (req, res) => {
    let status = req.query.status || "";

    await pemesanan
      .findAll({
        where: {
          [Op.or]: [
            {
              status_pemesanan: { [Op.like]: `%${status}%` },
            },
          ],
        },
        include: ["pelanggan", "tipe_kamar"],
      })
      .then((result) => res.json({ data: result }))
      .catch((error) => res.json({ message: error.message }));
  }
);

/**
 * @apiRoutes {get} /hotel/booking/:id
 * @apiName GetBookingById
 * @apiGroup Booking
 * @apiDescription Get booking data by id
 */
app.get(
  "/:id",
  // mustLogin,
  async (req, res) => {
    let params = { id_pemesanan: req.params.id };

    await pemesanan
      .findOne({ where: params, include: ["user", "pelanggan", "tipe_kamar"] })
      .then((result) => res.json({ data: result }))
      .catch((error) => res.json({ message: error.message }));
  }
);

/**
 * @apiRoutes {get} /hotel/booking/customer/:id
 * @apiName GetBookingByCustomerId
 * @apiGroup Booking
 * @apiDescription Get booking data by customer id
 */
app.get(
  "/customer/:id",
  //  mustLogin,
  async (req, res) => {
    let params = { id_pelanggan: req.params.id };

    await pemesanan
      .findAll({ where: params, include: ["user", "pelanggan", "tipe_kamar"] })
      .then((result) => res.json({ data: result }))
      .catch((error) => res.json({ message: error.message }));
  }
);

/**
 * @apiRoutes {post} /hotel/booking/
 * @apiName PostBooking
 * @apiGroup Booking
 * @apiDescription Insert booking data
 */
app.post("/", 
  mustLogin,
   async (req, res) => {
  try {
    // Generate receipt number and current timestamp
    const dt = Date.now();
    const receiptNum = Math.floor(Math.random() * (1000000000 - 99999999) + 99999999);

    // Extract check-in and check-out dates from request body
    const tgl_check_in = new Date(req.body.tgl_check_in);
    const tgl_check_out = new Date(req.body.tgl_check_out);

    // Determine the booking status
    let status_pemesanan;
    if (Date.now() < tgl_check_in) {
      status_pemesanan = "baru"; // Booking is new
    } else if (Date.now() >= tgl_check_in && Date.now() < tgl_check_out) {
      status_pemesanan = "check_in"; // Guest has checked in
    } else if (Date.now() >= tgl_check_out) {
      status_pemesanan = "check_out"; // Guest has checked out
    }

    const data = {
      nomor_pemesanan: `WH-${receiptNum}`,
      tgl_pemesanan: dt,
      tgl_check_in: req.body.tgl_check_in,
      tgl_check_out: req.body.tgl_check_out,
      id_pelanggan: req.userData.id_pelanggan,
      nama_tamu: req.body.nama_tamu,
      jumlah_kamar: req.body.jumlah_kamar,
      id_tipe_kamar: req.body.id_tipe_kamar,
      status_pemesanan: status_pemesanan,
      email_pemesanan: req.body.email_pemesanan.toLowerCase(), // Convert email to lowercase
    };

    // Validate required fields
    const requiredFields = [
      "tgl_check_in", "tgl_check_out", "nama_tamu",
      "jumlah_kamar", "id_tipe_kamar", "email_pemesanan"
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing ${field} in request body` });
      }
    }

    // Validate date format
    if (isNaN(tgl_check_in) || isNaN(tgl_check_out)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Check if check-out date is after check-in date
    if (tgl_check_in >= tgl_check_out) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // Find user by email_pemesanan (case-insensitive)
    const pelangganRecord = await pelanggan.findOne({
      where: { email: { [Op.like]: data.email_pemesanan } }
    });
    if (!pelangganRecord) {
      console.log("No pelanggan found with email:", data.email_pemesanan);
      return res.status(400).json({ message: "Invalid user" });
    }

    // Retrieve room data based on room type
    const dataKamar = await kamar.findAll({ where: { id_tipe_kamar: data.id_tipe_kamar } });
    if (!dataKamar || dataKamar.length === 0) {
      return res.status(400).json({ message: "No rooms available for the given type" });
    }

    // Retrieve room type details
    const dataTipeKamar = await tipe_kamar.findOne({ where: { id_tipe_kamar: data.id_tipe_kamar } });
    if (!dataTipeKamar) {
      return res.status(400).json({ message: "Room type not found" });
    }

    // Calculate total days of stay
    const totalHari = Math.round((tgl_check_out - tgl_check_in) / (1000 * 3600 * 24));
    if (totalHari <= 0) {
      return res.status(400).json({ message: "Invalid stay duration" });
    }

    // Check room availability and existing bookings
    const dataPemesanan = await tipe_kamar.findAll({
      attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
      where: { id_tipe_kamar: data.id_tipe_kamar },
      include: [
        {
          model: kamar,
          as: "kamar",
          attributes: ["id_kamar", "id_tipe_kamar"],
          include: [
            {
              model: detail_pemesanan,
              as: "detail_pemesanan",
              attributes: ["tgl_akses"],
              where: {
                tgl_akses: {
                  [Op.between]: [tgl_check_in, tgl_check_out],
                },
              },
            },
          ],
        },
      ],
    });

    // Get list of booked room IDs and filter available rooms
    const bookedRoomIds = dataPemesanan[0]?.kamar.map((room) => room.id_kamar) || [];
    const availableRooms = dataKamar.filter((room) => !bookedRoomIds.includes(room.id_kamar));

    if (availableRooms.length < data.jumlah_kamar) {
      return res.status(400).json({ message: "Not enough rooms available" });
    }

    // Calculate total price
    const totalHarga = dataTipeKamar.harga * data.jumlah_kamar * totalHari;

    // Create new booking (pemesanan)
    const newPemesanan = await pemesanan.create(data);

    // Create booking details for each day and room
    const selectedRooms = availableRooms.slice(0, data.jumlah_kamar);
    for (let i = 0; i < totalHari; i++) {
      for (const room of selectedRooms) {
        const tgl_akses = new Date(tgl_check_in);
        tgl_akses.setDate(tgl_akses.getDate() + i);

        const bookingDetail = {
          id_pemesanan: newPemesanan.id_pemesanan,
          id_kamar: room.id_kamar,
          tgl_akses: tgl_akses,
          harga: dataTipeKamar.harga,
        };

        await detail_pemesanan.create(bookingDetail);
      }
    }

    // Return success response
    res.json({
      success: true,
      message: "Booking successful",
      data: {
        nomor_pemesanan: data.nomor_pemesanan,
        id: newPemesanan.id_pemesanan, // Include the booking ID
      },
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});

/**
 * @apiRoutes {put} /hotel/booking/:id
 * @apiName PutBooking
 * @apiGroup Booking
 * @apiDescription Update booking data
 */
app.put(
  "/:id",
  // mustLogin, mustAdmin,
  async (req, res) => {
    let params = { id_pemesanan: req.params.id };

    let data = {
      status_pemesanan: req.body.status_pemesanan,
    };

    try {
      // Update the status first
      const updatedPemesanan = await pemesanan.update(data, {
        where: params,
        returning: true,
      });

      // Check if the status is being changed to 'check_out'
      if (data.status_pemesanan === 'check_out') {
        // Find and remove the detail_pemesanan entries to release the rooms
        await detail_pemesanan.destroy({
          where: { id_pemesanan: req.params.id },
        });
      }

      res.json({ success: 1, message: "Data has been updated!" });
    } catch (err) {
      console.error("Error during update:", err.message); // Log error message
      res.status(500).json({ message: err.message });
    }
  }
);


/**
 * @apiRoutes {delete} /hotel/booking/:id
 * @apiName DeleteBooking
 * @apiGroup Booking
 * @apiDescription Delete booking data
 */
app.delete(
  "/:id",
  // mustLogin, mustReceptionist,
  async (req, res) => {
    try {
      let params = { id_pemesanan: req.params.id };

      detail_pemesanan
        .destroy({ where: params })
        .then((result) => {
          if (result !== null) {
            pemesanan
              .destroy({ where: params })
              .then((results) =>
                res.json({ success: 1, message: "Data has been deleted!" })
              )
              .catch((err) => res.json({ message: err.message }));
          }
        })
        .catch((err) => res.json({ message: err.message }));
    } catch (err) {
      res.json({ message: err.message });
    }
  }
);

module.exports = app;
