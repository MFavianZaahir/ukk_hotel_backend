const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const SECRET_KEY = process.env.SECRET_KEY;

const { mustLogin, mustAdmin } = require('../middleware/auth');
const { uploadUser } = require('../middleware/uploadImage');
const user = require('../models/index').user;

const app = express();

const slugOptions = {
  replacement: '-',
  remove: /[*+~.()'"!:@]/g,
  lower: true,
  strict: true,
  locale: 'id'
};

/**
 * @apiRoutes {get} /hotel/user/
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiDescription Get all user data
 */
app.get('/', mustLogin, async (req, res) => {
  await user.findAll()
    .then(result => res.json({ success: 1, data: result }))
    .catch(error => res.json({ success: 0, message: error.message }))
});

/**
 * @apiRoutes {get} /hotel/user/:slug
 * @apiName GetUsersBySlug
 * @apiGroup User
 * @apiDescription Get user data by slug
 */
app.get('/:slug', mustLogin, mustAdmin, async (req, res) => {
  let params = { slug: req.params.slug };

  await user.findOne({ where: params })
    .then(result => res.json({ success: 1, data: result }))
    .catch(error => res.json({ success: 0, message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/user/
 * @apiName PostUser
 * @apiGroup User
 * @apiDescription Insert user data
 */
app.post('/register',uploadUser.single('foto'), async (req, res) => {
  if (!req.file) return res.json({ message: "No file uploaded" })

  let finalImageURL = req.protocol + '://' + req.get('host') + '/usr/' + req.file.filename;

  let data = {
    nama_user: req.body.nama_user,
    foto: finalImageURL,
    slug: slugify(req.body.nama_user, slugOptions),
    email: req.body.email,
    password: md5(req.body.password),
    role: req.body.role
  }

  await user.create(data)
    .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
    .catch(error => res.json({ success: 0, message: error.message }))
});

/**
 * @apiRoutes {put} /hotel/user/
 * @apiName PutUser
 * @apiGroup User
 * @apiDescription Update user data
 */
app.put('/', uploadUser.single('foto'), async (req, res) => {
  if (!req.file) return res.json({ message: "No file uploaded" })

  let params = { id_user: req.body.id_user }
  let data = {
    nama_user: req.body.nama_user,
    slug: slugify(req.body.nama_user, slugOptions),
    email: req.body.email,
    password: md5(req.body.password),
    role: req.body.role
  }

  if (req.file) {
    let oldImg = await user.findOne({ where: params });
    let oldImgName = oldImg.foto.replace(req.protocol + '://' + req.get('host') + '/usr/', '');

    let loc = path.join(__dirname, '../public/usr/', oldImgName);
    fs.unlink(loc, (err) => console.log(err));

    let finalImageURL = req.protocol + '://' + req.get('host') + '/usr/' + req.file.filename;
    data.foto = finalImageURL;
  }

  await user.update(data, { where: params })
    .then(result => res.json({ success: 1, message: "Data has been updated" }))
    .catch(error => res.json({ success: 0, message: error.message }))
});

/**
 * @apiRoutes {delete} /hotel/user/:id
 * @apiName DeleteUser
 * @apiGroup User
 * @apiDescription Delete user data
 */
app.delete('/:id', mustLogin, mustAdmin, async (req, res) => {
  let params = { id_user: req.params.id }

  let delImg = await user.findOne({ where: params });
  if (delImg) {
    let delImgName = delImg.foto.replace(req.protocol + '://' + req.get('host') + '/usr/', '');
    let loc = path.join(__dirname, '../public/usr/', delImgName);
    fs.unlink(loc, (err) => console.log(err));
  }

  await user.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ success: 0, message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/user/login
 * @apiName LoginUser
 * @apiGroup User
 * @apiDescription Login user
 */
app.post('/login', async (req, res) => {
  let params = {
    email: req.body.email,
    password: md5(req.body.password),
  }

  await user.findOne({ where: params })
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
