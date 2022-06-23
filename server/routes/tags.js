const router = require("express").Router();
const pool = require("../config/db");

router.get("/", async(req, res) => {
    try {
        const tags_query = await pool.query("SELECT * FROM tags");

        res.status(200).json({ success: true, tags: tags_query.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;