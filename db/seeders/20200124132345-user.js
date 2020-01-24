'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      userName: 'admin',
      password: '$2a$10$QCK3YF6XRprZkzCkzxtPwuPV2lOzb0lM6AeFHz0fCpxLovKRZQtlK',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
