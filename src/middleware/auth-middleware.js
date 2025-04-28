import jwt from "jsonwebtoken";
import {prismaClient} from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization').replace("Bearer ", "");
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
}
