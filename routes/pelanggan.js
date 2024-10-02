const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const SECRET_KEY = process.env.SECRET_KEY;

const { mustLogin, mustAdmin } = require('../middleware/auth');
const { uploadUser } = require('../middleware/uploadImage');
const pelanggan = require('../models/index').pelanggan;

const app = express();

const slugOptions = {
  replacement: '-',
  remove: /[*+~.()'"!:@]/g,
  lower: true,
  strict: true,
  locale: 'id'
};

/**
 * @apiRoutes {get} /hotel/customer/
 * @apiName GetAllCustomers
 * @apiGroup Customer
 * @apiDescription Get all customer data
 */
app.get('/', mustLogin, async (req, res) => {
  await pelanggan.findAll()
    .then(result => res.json({ data: result }))
    .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {get} /hotel/customer/:slug
 * @apiName GetCustomerById
 * @apiGroup Customer
 * @apiDescription Get customer data by slug
 */
app.get('/:slug', mustLogin, mustAdmin, async (req, res) => {
  let params = { slug: req.params.slug };

  await pelanggan.findOne({ where: params })
    .then(result => res.json({ data: result }))
    .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/customer/
 * @apiName PostCustomer
 * @apiGroup Customer
 * @apiDescription Insert customer data
 */
app.post('/', uploadUser.single('foto'), async (req, res) => {
  if (!req.file) return res.json({ message: "No file uploaded" })

  let finalImageURL = req.protocol + '://' + req.get('host') + '/usr/' + req.file.filename;

  let data = {
    nama: req.body.nama,
    foto: finalImageURL,
    slug: slugify(req.body.nama, slugOptions),
    email: req.body.email,
    password: md5(req.body.password),
    role: 'pelanggan'
  }

  await pelanggan.create(data)
    .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
    .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {put} /hotel/customer/
 * @apiName PutCustomer
 * @apiGroup Customer
 * @apiDescription Update customer data
 */
app.put('/', mustLogin, uploadUser.single('foto'), async (req, res) => {
  if (!req.file) return res.json({ message: "No file uploaded" })

  let params = { id_pelanggan: req.body.id_pelanggan }
  let data = {
    nama: req.body.nama,
    slug: slugify(req.body.nama, slugOptions),
    email: req.body.email,
    password: md5(req.body.password),
  }

  if (req.file) {
    let oldImg = await pelanggan.findOne({ where: params });
    let oldImgName = oldImg.foto.replace(req.protocol + '://' + req.get('host') + '/usr/', '');

    let loc = path.join(__dirname, '../public/usr/', oldImgName);
    fs.unlink(loc, (err) => console.log(err));

    let finalImageURL = req.protocol + '://' + req.get('host') + '/usr/' + req.file.filename;
    data.foto = finalImageURL;
  }

  await pelanggan.update(data, { where: params })
    .then(result => res.json({ success: 1, message: "Data has been updated" }))
    .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {delete} /hotel/customer/:id
 * @apiName DeleteCustomer
 * @apiGroup Customer
 * @apiDescription Delete customer data
 */
app.delete('/:id', mustLogin, mustAdmin, async (req, res) => {
  let params = { id_pelanggan: req.params.id }

  let delImg = await pelanggan.findOne({ where: params });
  if (delImg) {
    let delImgName = delImg.foto.replace(req.protocol + '://' + req.get('host') + '/usr/', '');
    let loc = path.join(__dirname, '../public/usr/', delImgName);
    fs.unlink(loc, (err) => console.log(err));
  }

  await pelanggan.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/customer/login
 * @apiName LoginCustomer
 * @apiGroup Customer
 * @apiDescription Login customer
 */
app.post('/login', async (req, res) => {
  let params = {
    email: req.body.email,
    password: md5(req.body.password),
  }

  await pelanggan.findOne({ where: params })
    .then(result => {
      if (result) {
        let payload = JSON.stringify(result);
        let token = jwt.sign(payload, SECRET_KEY);
        res.json({ success: 1, message: "Login success, welcome back!", data: result, token: token })
      } else {
        res.json({ success: 0, message: "Invalid email or password!" })
      }
    })
    .catch(error => res.json({ message: error.message }))
});

module.exports = app;
