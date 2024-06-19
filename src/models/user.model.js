import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../DB_Connection/ConnectToDB.js';

export const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for Google users
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        required: true
    },
    password: {
        type: DataTypes.STRING,
        // allowNull: true // Allow null for Google users
        required: true
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true, // Only non-null for Google users
        unique: true
    }
});

export const initializeUserModel = async () => {
    try {
        await User.sync();
        console.log("Succesfully created or exist user table");
    }
    catch (error) {
        console.error('Error creating user table:', error);
    }
};
