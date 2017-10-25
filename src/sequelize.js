import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: 'Amazon RDS',
  },
});

module.exports = sequelize;
