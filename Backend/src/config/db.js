import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to console.log to see SQL queries
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

export default sequelize;
