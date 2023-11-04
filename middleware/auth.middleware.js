import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

export default {
    checkUserAuth: async (req, res, next) => {
        let token;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ")[1];

            try {

                const { userID } = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
                // console.log(userID);
                req.user = await UserModel.findByPk(userID, { attributes: { exclude: ['password'] } });
                if(req.user==null){
                    return res.status(404).json({ error: true, message: "User not found" });
                }
                // console.log("Hii", req.user)
                next();
            } catch (err) {
                res.status(401).json({ message: "Unauthorized User" });
            }

        } else {
            res.status(400).json({ message: "No token" });

        }

    },
    checkRefreshAuth: async (req, res, next) => {
        let token;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ")[1];

            try {

                const { userID } = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
                // console.log(userID);
                req.user = await UserModel.findByPk(userID, { attributes: { exclude: ['password'] } });
              //  console.log("Hii", req.user)
                next();
            } catch (err) {
                res.status(401).json({ message: "Unauthorized User" });
            }

        } else {
            res.status(400).json({ message: "No token" });

        }

    },

}
