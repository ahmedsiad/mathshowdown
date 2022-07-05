const pool = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const Authorized = async(req, res, next) => {
    try {
        const jwtToken = req.headers.authorization.split(' ')[1];

        if (jwtToken === "null") {
            return res.status(403).json({ success: false, message: "Not Authorized" });
        }

        const token_query = await pool.query("SELECT * FROM btokens WHERE token = $1", [jwtToken]);
        if (token_query.rows > 0) {
            return res.status(403).json({ success: false, message: "Not Authorized" });
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).send({ success: false, message: "Not Authorized" });
    }
};

const AdminAuthorized = async(req, res, next) => {
    try {
        const user_id = req.user;

        const user_query = await pool.query("SELECT is_admin FROM users WHERE id = $1", [user_id]);
        if (!user_query.rows[0].is_admin) {
            return res.status(403).send({ success: false, message: "Not Authorized" });
        }

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).send({ success: false, message: "Not Authorized" });
    }
};

module.exports = {
    Authorized,
    AdminAuthorized
};