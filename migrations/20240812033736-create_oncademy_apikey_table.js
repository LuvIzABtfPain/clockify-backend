'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Tạo bảng oncademy_apikey với các cột tương ứng
    await queryInterface.createTable('oncademy_apikey', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      apikey: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'api key get from clockify'  // Thêm mô tả (không bắt buộc)
      },
      clockifyUID: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'User ID fetch from Clockify'  // Thêm mô tả (không bắt buộc)
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Xóa bảng oncademy_apikey khi rollback
    await queryInterface.dropTable('oncademy_apikey');
  }
};
