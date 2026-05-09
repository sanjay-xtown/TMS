'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tracking_locations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      busId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      speed: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('active', 'stopped', 'breakdown', 'reached', 'completed'),
        defaultValue: 'stopped',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tracking_locations');
  }
};
