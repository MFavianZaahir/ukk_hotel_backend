'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pemesanan', {
      id_pemesanan: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nomor_pemesanan: {
        type: Sequelize.STRING
      },
      id_pelanggan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pelanggan',  // Make sure 'pelanggan' exists and has id_pelanggan as primary key
          key: 'id_pelanggan'
        },
        onDelete: 'CASCADE', // Optional: handle deletion behavior
        onUpdate: 'CASCADE'
      },
      tgl_pemesanan: {
        type: Sequelize.DATE
      },
      tgl_check_in: {
        type: Sequelize.DATE
      },
      tgl_check_out: {
        type: Sequelize.DATE
      },
      nama_tamu: {
        type: Sequelize.STRING
      },
      email_pemesanan: {
        type: Sequelize.STRING
      },
      jumlah_kamar: {
        type: Sequelize.INTEGER
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tipe_kamar',  // Make sure 'tipe_kamar' exists with id_tipe_kamar
          key: 'id_tipe_kamar'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status_pemesanan: {
        type: Sequelize.ENUM('baru', 'check_in', 'check_out')
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',  // Make sure 'user' exists with id_user
          key: 'id_user'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pemesanan');
  }
};
