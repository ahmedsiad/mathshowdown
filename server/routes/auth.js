const router = require("express").Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { Authorized } = require("../middleware/authorization");
const { RegisterValidator } = require("../middleware/validators");

router.post("/register", RegisterValidator, async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)", [username, email]);
        if (user.rows.length > 0) {
            if (user.rows[0].username === username) {
                return res.status(409).json({ success: false, message: "Username already exists!" });
            } else {
                return res.status(409).json({ success: false, message: "Email already exists!" });
            }
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcrptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [username, email, bcrptPassword]);
        
        const token = jwtGenerator(newUser.rows[0].id);

        return res.status(201).json({ success: true, token: token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/login", async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)", [username, email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Username/Email or Password is incorrect" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Username/Email or Password is incorrect" });
        }

        const token = jwtGenerator(user.rows[0].id);

        return res.status(200).json({ success: true, token: token });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/logout", Authorized, async(req, res) => {
    try {
        const user_id = req.user;
        const jwtToken = req.headers.authorization.split(' ')[1];

        const token_query = await pool.query("INSERT INTO btokens (token) VALUES ($1) RETURNING *", [jwtToken]);

        return res.status(201).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/verify", Authorized, async(req, res) => {
    try {
        const user_id = req.user;

        const user_query = await pool.query("SELECT username, rating, is_admin FROM users WHERE id = $1", [user_id]);

        return res.status(200).json({ success: true, authorized: true, user: user_query.rows[0] });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;