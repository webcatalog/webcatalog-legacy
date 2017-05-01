import Sequelize from 'sequelize';

import sequelize from '../sequelize';

const Session = sequelize.define('session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000),
});

Session.sync();

module.exports = Session;
