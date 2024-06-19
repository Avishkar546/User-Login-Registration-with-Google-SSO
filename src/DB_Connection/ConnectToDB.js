import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('Authentication_System', 'postgres', 'Navodaya@007', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // make true if you want to see random SQL queries
});

export const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}