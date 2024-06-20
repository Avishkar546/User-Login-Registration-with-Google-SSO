import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize("postgres://hubspot_user_login_user:j7io1NOiKKqDMB5tVOwh3tZjU6Qd9rtv@dpg-cpp93k88fa8c739b93i0-a.oregon-postgres.render.com/hubspot_user_login", {
    port: 5432,
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // make true if you want to see random SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // You might need to tweak this for your SSL settings
        }
    }
});

export const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
}