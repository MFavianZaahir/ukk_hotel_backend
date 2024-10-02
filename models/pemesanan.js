'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    static associate(models) {
      // Foreign key for the user who made the booking
      this.belongsTo(models.user, { foreignKey: 'id_user', as: 'user' });
      
      // Foreign key for pelanggan (customer)
      this.belongsTo(models.pelanggan, { foreignKey: 'id_pelanggan', as: 'pelanggan' });

      // Foreign key for room type (tipe kamar)
      this.belongsTo(models.tipe_kamar, { foreignKey: 'id_tipe_kamar', as: 'tipe_kamar' });

      // Associated with detail_pemesanan
      this.hasMany(models.detail_pemesanan, { foreignKey: 'id_pemesanan', as: 'detail_pemesanan' });
    }
  }

  pemesanan.init({
    id_pemesanan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nomor_pemesanan: DataTypes.STRING,
    id_pelanggan: DataTypes.INTEGER,  // Foreign key referencing pelanggan
    tgl_pemesanan: DataTypes.DATE,
    tgl_check_in: DataTypes.DATE,
    tgl_check_out: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    email_pemesanan: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER,  // Foreign key referencing tipe_kamar
    status_pemesanan: DataTypes.ENUM('baru', 'check_in', 'check_out'),
    id_user: DataTypes.INTEGER,  // Foreign key referencing user
  }, {
    sequelize,
    modelName: 'pemesanan',
    tableName: 'pemesanan',
  });

  return pemesanan;
};
