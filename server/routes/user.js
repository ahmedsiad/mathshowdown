const router = require("express").Router();
const pool = require("../config/db");

router.get("/profile/:username", async(req, res) => {
    try {
        const { username } = req.params;
        
        const user_query = await pool.query("SELECT id, username, rating, registration_date FROM users WHERE username = $1", [username]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const user = user_query.rows[0];
        const history = await pool.query("SELECT * FROM participants WHERE user_id = $1", [user.id]);

        user.contest_history = history.rows;

        return res.status(200).json({ success: true, user: user });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/profile/:username/submissions", async(req, res) =>{
    try {
        const { username } = req.params;

        const user_query = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        
        const submissions_query = await pool.query("SELECT * FROM submissions WHERE user_id = $1", [user_query.rows[0].id]);

        return res.status(200).json({ success: true, submissions: submissions_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:username", async(req, res) => {
    try {
        const { username } = req.params;

        const user_query = await pool.query("SELECT username, rating FROM users WHERE username = $1", [username]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        
        return res.status(200).json({ success: true, user: user_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;