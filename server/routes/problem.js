const router = require("express").Router();
const pool = require("../config/db");

// TODO: Future problems page + routes
/*router.get("/", async(req, res) => {
    try {
        const problem_query = await pool.query("SELECT * FROM problems");

        return res.status(200).json({ success: true, problems: problem_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});*/

module.exports = router;