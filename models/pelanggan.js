'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pelanggan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.pemesanan, { foreignKey: 'id_pelanggan', as: 'pemesanan' });
    }
  }
  pelanggan.init({
    id_pelanggan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: DataTypes.STRING,
    foto: DataTypes.TEXT,
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pelanggan',
    tableName: 'pelanggan'
  });
  return pelanggan;
};