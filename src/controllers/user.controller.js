import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';


export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({
            success: true,
            message: "Registered succesfully",
            user
        });
    } catch (error) {
        res.send({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ success: true, message: "Invalid1 credentials" });
        }

        const user = await User.findOne({ where: { email } });

        //If user dose not exists
        if (!user) {
            return res.status(502).send({ success: true, message: "User not found. Please register" });
        }

        const validUser = await bcrypt.compare(password, user.password);

        if (!validUser) {
            return res.status(502).send({ success: true, message: "Invalid credentials" });
        }

        // Create the JSON web token for valid logged in user.
        const payload = {
            user: {
                email: user.id
            }
        };
        const jwtToken = Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' });

        // Send the user user web token in response to store it in localStorage.
        return res.send({
            success: true,
            message: "Login succesfully",
            jwtToken,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(501).send({
            success: false,
            message: "Internal Server error",
            error
        });
    }
}