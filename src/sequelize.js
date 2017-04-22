import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://quanglam2807:@localhost:5432/quanglam2807');

module.exports = sequelize;
