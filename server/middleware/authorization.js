const pool = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
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