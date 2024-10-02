'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('tipe_kamar', [{
      nama_tipe_kamar: 'Deluxe',
      harga: '680000',
      deskripsi: 'ini adalah deskripsi dari tipe kamar deluxe',
      foto: null,
    }], {});

    await queryInterface.bulkInsert('tipe_kamar', [{
      nama_tipe_kamar: 'Luxury',
      harga: '550000',
      deskripsi: 'ini adalah deskripsi dari tipe kamar luxury',
      foto: null,
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('tipe_kamar', null, {});
  }
};
