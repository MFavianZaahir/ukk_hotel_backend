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

    await queryInterface.bulkInsert('kamar', [{
      nomor_kamar: 101,
      id_tipe_kamar: 1,
    }], {});

    await queryInterface.bulkInsert('kamar', [{
      nomor_kamar: 102,
      id_tipe_kamar: 2,
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('kamar', null, {});
  }
};
