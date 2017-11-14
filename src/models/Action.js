import Sequelize from 'sequelize';

import sequelize from '../sequelize';

const Action = sequelize.define('action', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  actionName: {
    type: Sequelize.STRING,
  },
});

export default Action;
