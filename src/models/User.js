import Sequelize from 'sequelize';

import sequelize from '../sequelize';

const User = sequelize.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
  },
  profilePicture: {
    type: Sequelize.STRING,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
  },
  displayName: {
    type: Sequelize.STRING,
  },
  googleId: {
    type: Sequelize.STRING,
  },
  facebookId: {
    type: Sequelize.STRING,
  },
  twitterId: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: () => true,
  },
  resetPasswordToken: {
    type: Sequelize.STRING,
  },
  resetPasswordExpires: {
    type: Sequelize.DATE,
  },
  verifyToken: {
    type: Sequelize.STRING,
  },
});

User.sync();

module.exports = User;
