import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: !process.env.DATABASE_URL.startsWith('postgresql://localhost'),
  },
});

module.exports = sequelize;
