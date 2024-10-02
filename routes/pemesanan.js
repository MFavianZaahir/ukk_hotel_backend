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

const app = express();

/**
 * @apiRoutes {get} /hotel/booking/
 * @apiName GetAllBooking
 * @apiGroup Booking
 * @apiDescription Get all booking data
 */
app.get("/", mustLogin, async (req, res) => {
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
      include: ["user", "pelanggan", "tipe_kamar"],
    })
    .then((result) => res.json({ data: result }))
    .catch((error) => res.json({ message: error.message }));
});

/**
 * @apiRoutes {get} /hotel/booking/:id
 * @apiName GetBookingById
 * @apiGroup Booking
 * @apiDescription Get booking data by id
 */
app.get("/:id", mustLogin, async (req, res) => {
  let params = { id_pemesanan: req.params.id };

  await pemesanan
    .findOne({ where: params, include: ["user", "pelanggan", "tipe_kamar"] })
    .then((result) => res.json({ data: result }))
    .catch((error) => res.json({ message: error.message }));
});

/**
 * @apiRoutes {get} /hotel/booking/customer/:id
 * @apiName GetBookingByCustomerId
 * @apiGroup Booking
 * @apiDescription Get booking data by customer id
 */
app.get("/customer/:id", mustLogin, async (req, res) => {
  let params = { id_pelanggan: req.params.id };

  await pemesanan
    .findAll({ where: params, include: ["user", "pelanggan", "tipe_kamar"] })
    .then((result) => res.json({ data: result }))
    .catch((error) => res.json({ message: error.message }));
});

/**
 * Todos:
 * 1. Check if the room is available on the selected date
 * 2. Check if the room is available for the selected number of rooms
 * 3. Check if the check-in and check-out date is valid
 * 4. Check if the total price is correct
 * 5. Check if the user is valid
 * 6. Check if data is send correctly
 * 7. Check if the room is available for the selected date
 */

/**
 * @apiRoutes {post} /hotel/booking/
 * @apiName PostBooking
 * @apiGroup Booking
 * @apiDescription Insert booking data
 */
app.post("/", mustLogin, async (req, res) => {
  try {
    let dt = Date.now();
    let receiptNum = Math.floor(
      Math.random() * (1000000000 - 99999999) + 99999999
    );

    let data = {
      nomor_pemesanan: `WH-${receiptNum}`,
      // Removed id_pelanggan, will use email instead
      tgl_pemesanan: dt,
      tgl_check_in: req.body.tgl_check_in,
      tgl_check_out: req.body.tgl_check_out,
      nama_tamu: req.body.nama_tamu,
      jumlah_kamar: req.body.jumlah_kamar,
      id_tipe_kamar: req.body.id_tipe_kamar,
      status_pemesanan: req.body.status_pemesanan,
      email_pemesanan: req.body.email_pemesanan, // Now using email_pemesanan for user identification
    };

    // Error handling for missing fields
    const requiredFields = [
      "tgl_check_in",
      "tgl_check_out",
      "nama_tamu",
      "jumlah_kamar",
      "id_tipe_kamar",
      "status_pemesanan",
      "email_pemesanan", // Using email_pemesanan instead of id_user and id_pelanggan
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing ${field} in request body` });
      }
    }

    // Validate date format
    if (
      isNaN(new Date(data.tgl_check_in)) ||
      isNaN(new Date(data.tgl_check_out))
    ) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Validate if check-in date is before check-out date
    if (new Date(data.tgl_check_in) >= new Date(data.tgl_check_out)) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date" });
    }

    // Find user by email_pemesanan
    const pelangganRecord = await pelanggan.findOne({
      where: { email: data.email_pemesanan },
    });
    if (!pelangganRecord) {
      return res.status(400).json({ message: "Invalid user" });
    }

    // Retrieve room data
    const dataKamar = await kamar.findAll({
      where: { id_tipe_kamar: data.id_tipe_kamar },
    });

    if (!dataKamar || dataKamar.length === 0) {
      return res
        .status(400)
        .json({ message: "No rooms available for the given type" });
    }

    // Retrieve room type data
    const dataTipeKamar = await tipe_kamar.findOne({
      where: { id_tipe_kamar: data.id_tipe_kamar },
    });

    if (!dataTipeKamar) {
      return res.status(400).json({ message: "Room type not found" });
    }

    // Calculate total days of stay
    const checkIn = new Date(data.tgl_check_in);
    const checkOut = new Date(data.tgl_check_out);
    const totalHari = Math.round((checkOut - checkIn) / (1000 * 3600 * 24));

    if (totalHari <= 0) {
      return res.status(400).json({ message: "Invalid stay duration" });
    }

    // Check if the total price is correct
    const totalHarga = dataTipeKamar.harga * data.jumlah_kamar * totalHari;
    console.log("Total days:", totalHarga);
    // if (req.body.total_price !== totalHarga) {
    //   return res.status(400).json({ message: "Total price is incorrect" });
    // }

    // Check room availability
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
                  [Op.between]: [data.tgl_check_in, data.tgl_check_out],
                },
              },
            },
          ],
        },
      ],
    });

    const bookedRoomIds =
      dataPemesanan[0]?.kamar.map((room) => room.id_kamar) || [];
    const availableRooms = dataKamar.filter(
      (room) => !bookedRoomIds.includes(room.id_kamar)
    );

    console.log(availableRooms);

    if (availableRooms.length < data.jumlah_kamar) {
      return res.status(400).json({ message: "Not enough rooms available" });
    }

    // Create booking and booking details
    const selectedRooms = availableRooms.slice(0, data.jumlah_kamar);

    const newPemesanan = await pemesanan.create(data);
    console.log("i lovebooys", newPemesanan);

    for (let i = 0; i < totalHari; i++) {
      for (const room of selectedRooms) {
        let tgl_akses = new Date(checkIn);
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
      data: { nomor_pemesanan: data.nomor_pemesanan, total_harga: totalHarga },
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

function printReceipt(bookingDetails) {
  console.log("Receipt");
  console.log("-------");
  console.log(`Booking ID: ${bookingDetails.id_pemesanan}`);
  console.log(`Customer Name: ${bookingDetails.nama_pelanggan}`);
  console.log(`Check-in Date: ${bookingDetails.checkIn}`);
  console.log(`Check-out Date: ${bookingDetails.checkOut}`);
  console.log(`Total Amount: ${bookingDetails.total_harga}`);
  console.log("Thank you for your booking!");
}

/**
 * @apiRoutes {put} /hotel/booking/:id
 * @apiName PutBooking
 * @apiGroup Booking
 * @apiDescription Update booking data
 */
app.put("/:id", mustLogin, async (req, res) => {
  let params = { id_pemesanan: req.params.id };

  let data = {
    status_pemesanan: req.body.status_pemesanan,
    id_user: req.body.id_user,
  };

  await pemesanan
    .update(data, { where: params })
    .then((result) =>
      res.json({ success: 1, message: "Data has been updated!" })
    )
    .catch((err) => res.json({ message: err.message }));
});

/**
 * @apiRoutes {delete} /hotel/booking/:id
 * @apiName DeleteBooking
 * @apiGroup Booking
 * @apiDescription Delete booking data
 */
app.delete("/:id", mustLogin, mustReceptionist, async (req, res) => {
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
});

module.exports = app;
