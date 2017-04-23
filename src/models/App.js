import Sequelize from 'sequelize';

import sequelize from '../sequelize';

const App = sequelize.define('app', {
  slug: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING,
  },
  version: {
    type: Sequelize.INTEGER,
  },
  description: {
    type: Sequelize.STRING,
  },
  installCount: {
    type: Sequelize.INTEGER,
  },
}, {
  freezeTableName: true,
});

App.sync({ force: true });
