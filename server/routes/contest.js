const router = require("express").Router();
const pool = require("../config/db");

router.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const contest_query = await pool.query("SELECT * FROM contests WHERE id = $1", [id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }

        return res.status(200).json({ success: true, contest: contest_query.rows[0] });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})

module.exports = router;