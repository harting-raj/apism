import bcrypt from 'bcryptjs'
import Users from '../models/user.model.js'
import jwt from 'jsonwebtoken';


export default {
    registerUser: async (req, res) => {

        const { firstName, lastName, contactNumber, password, role, email } = req.body;
        if (firstName && lastName && contactNumber && password && role && email) {

            try {
                const user = await Users.findOne({ where: { email: email } });

                if (!user) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await Users.create({

                        firstName, lastName, contactNumber, password: hashedPassword, role, email
                    });
                    const accessToken = jwt.sign({ userID: newUser.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '5d' });
                    const refreshToken = jwt.sign({ userID: newUser.id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '30d' });

                    res.status(201).json({ error: false, message: 'User register successfully', accessToken, refreshToken });
                } else {
                    res.status(409).send({ error: true, message: "Email already registered" });
                }
            } catch (error) {
                res.status(500).json({ error: true, message: error.message });
            }
        }
        else {
            res.status(400).send({ error: true, message: "All fields are required" });
        }
    },
    userLogin: async (req, res) => {

        try {
            const { email, password, role } = req.body; //get email and password from request body

            if (email && password, role) { //check if email and password are provided
                const user = await Users.findOne({ where: { email: email } }); //check if user exists

                if (user) { //if user exists
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (isMatch && role == user.role) { //check if email and password match

                        const accessToken = jwt.sign({ userID: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '5d' });
                        const refreshToken = jwt.sign({ userID: user.id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '30d' });
                        return res.status(200).json({ error: false, message: "Login successful", accessToken, refreshToken }); //return success message
                    }
                    else {
                        return res.status(401).json({ error: true, message: "Invalid credentials" }); //return error message
                    }
                }
                else {
                    return res.status(400).json({ error: true, message: "User does not exist" }); //return error message
                }
            }
            else {
                return res.status(400).json({ error: true, message: "Please fill in all fields" }); //return error message
            }


        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }

    },
    userProfile: async (req, res) => {
        try {
           
            return res.status(200).json({ error: false, user: req.user });
        }
        catch (error) {
            return res.status(500).json({ message: error.message }); //return error message
        }
    },
    changePassword: async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        if (oldPassword && newPassword) {
            if (oldPassword !== newPassword) {
                try {
                    const user = await Users.findByPk(req.user.id);
                    if (user) {
                        const isMatch = await bcrypt.compare(oldPassword, user.password);
                        if (isMatch) {
                            const hashedPassword = await bcrypt.hash(newPassword, 10); //hash the password
                            user.password = hashedPassword;
                            await user.save();
                            return res.status(200).json({ error: false, message: "Password changed successfully" }); //return success message
                        }
                        else {
                            return res.status(401).json({ message: "Invalid credentials" }); //return error message
                        }
                    }
                    else {
                        return res.status(400).json({ error: true, message: "User does not exist" }); //return error message
                    }

                }
                catch (error) {
                    return res.status(500).json({ error: true, message: error.message }); //return error message
                }
            } else {
                return res.status(400).json({ error: true, message: "Old Password and New password can't be same " }); //return error message

            }
        }
        else {
            return res.status(400).json({ error: true, message: "Please fill in all fields" }); //return error message
        }
    },
    regenerateAccessToken: async (req, res) => {
        const user = await Users.findByPk(req.user.id);
        if (user) {
            try {
                const accessToken = jwt.sign({ userID: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '5d' });
                return res.status(200).json({ error: false, message: "Access token regenerated successfully", accessToken });
            } catch (error) {
                return res.status(500).json({ error: true, message: "Token creation error" }); //return error message
            }
        } else {
            return res.status(400).json({ error: true, message: "User does not exit!" })
        }

    }
}