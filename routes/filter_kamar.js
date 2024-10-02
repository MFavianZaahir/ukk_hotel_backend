const express = require('express');
const { Op } = require('sequelize');

const { mustLogin, mustReceptionist, mustAdmin } = require('../middleware/auth');
const tipe_kamar = require('../models/index').tipe_kamar;
const kamar = require('../models/index').kamar;
const detail_pemesanan = require('../models/index').detail_pemesanan;

const app = express();

/**
 * @apiRoutes {post} /hotel/filter/
 * @apiName PostFilter
 * @apiGroup Filter
 * @apiDescription Filter room by date
 */
app.post('/', mustLogin, async (req, res) => {
    let checkInDate = req.body.tgl_check_in;
    let checkOutDate = req.body.tgl_check_out;

    let roomData = await tipe_kamar.findAll({ include: [{ model: kamar, as: "kamar" }] });

    let roomBookedData = await tipe_kamar.findAll({
        attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: kamar,
                as: "kamar",
                include: [
                    {
                        model: detail_pemesanan,
                        as: "detail_pemesanan",
                        attributes: ["tgl_akses"],
                        where: {
                            tgl_akses: {
                                [Op.between]: [checkInDate, checkOutDate],
                            },
                        },
                    },
                ],
            },
        ],
    });

    let available = [];
    let availableByType = [];

    for (let i = 0; i < roomData.length; i++) {
        roomData[i].kamar.forEach((kamar) => {
            let isBooked = false;
            roomBookedData.forEach((booked) => {
                booked.kamar.forEach((bookedRoom) => {
                    if (kamar.id_kamar === bookedRoom.id_kamar) {
                        isBooked = true;
                    }
                });
            });
            if (!isBooked) {
                available.push(kamar);
            }
        });
    }

    for (let i = 0; i < roomData.length; i++) {
        let roomType = {};
        roomType.id_tipe_kamar = roomData[i].id_tipe_kamar;
        roomType.nama_tipe_kamar = roomData[i].nama_tipe_kamar;
        roomType.slug = roomData[i].slug;
        roomType.harga = roomData[i].harga;
        roomType.deskripsi = roomData[i].deskripsi;
        roomType.foto = roomData[i].foto;
        roomType.kamar = [];
        available.forEach((kamar) => {
            if (kamar.id_tipe_kamar === roomData[i].id_tipe_kamar) {
                roomType.kamar.push(kamar);
            }
        });
        if (roomType.kamar.length > 0) {
            availableByType.push(roomType);
        }
    }

    return res.json({ kamar: availableByType });
});

/**
 * @apiRoutes {get} /hotel/filter/:id
 * @apiName GetFilterById
 * @apiGroup Filter
 * @apiDescription Filter room by date and room type
 */
app.get('/:id', mustLogin, mustAdmin, async (req, res) => {
    let checkInDate = req.query.tgl_check_in;
    let checkOutDate = req.query.tgl_check_out;

    let roomData = await tipe_kamar.findAll({
        where: {
            id_tipe_kamar: req.params.id,
        },
        include: [{ model: kamar, as: "kamar" }],
    });

    let roomBookedData = await tipe_kamar.findAll({
        attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
        include: [
            {
                model: kamar,
                as: "kamar",
                include: [
                    {
                        model: detail_pemesanan,
                        as: "detail_pemesanan",
                        attributes: ["tgl_akses"],
                        where: {
                            tgl_akses: {
                                [Op.between]: [checkInDate, checkOutDate],
                            },
                        },
                    },
                ],
            },
        ],
    });

    let available = [];
    let availableByType = [];

    for (let i = 0; i < roomData.length; i++) {
        roomData[i].kamar.forEach((kamar) => {
            let isBooked = false;
            roomBookedData.forEach((booked) => {
                booked.kamar.forEach((bookedRoom) => {
                    if (kamar.id_kamar === bookedRoom.id_kamar) {
                        isBooked = true;
                    }
                });
            });
            if (!isBooked) {
                available.push(kamar);
            }
        });
    }

    for (let i = 0; i < roomData.length; i++) {
        let roomType = {};
        // roomType.id_tipe_kamar = roomData[i].id_tipe_kamar;
        // roomType.nama_tipe_kamar = roomData[i].nama_tipe_kamar;
        // roomType.slug = roomData[i].slug;
        // roomType.harga = roomData[i].harga;
        // roomType.deskripsi = roomData[i].deskripsi;
        // roomType.foto = roomData[i].foto;
        roomType.kamar = [];
        available.forEach((kamar) => {
            if (kamar.id_tipe_kamar === roomData[i].id_tipe_kamar) {
                roomType.kamar.push(kamar);
            }
        });
        if (roomType.kamar.length > 0) {
            availableByType.push(roomType);
        }
    }

    return res.json({ data: availableByType });
});

module.exports = app
