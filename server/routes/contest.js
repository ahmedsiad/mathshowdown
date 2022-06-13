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
});

router.get("/:id/problems/:problem_index", async(req, res) => {
    try {
        const { id, problem_index } = req.params;

        const problem_query = await pool.query("SELECT * FROM problems WHERE contest_id = $1 AND problem_index = $2", [id, problem_index]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Problem does not exist" });
        }

        return res.status(200).json({ success: true, problem: problem_query.rows[0] });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:id/problems", async(req, res) => {
    try {
        const { id } = req.params;

        const problem_query = await pool.query("SELECT * FROM problems WHERE contest_id = $1", [id]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }

        return res.status(200).json({ success: true, problems: problem_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});


router.get("/:id/users", async(req, res) => {
    try {
        const { id } = req.params;

        const user_query = await pool.query("SELECT * FROM participants WHERE contest_id = $1", [id]);
        
        return res.status(200).json({ success: true, users: user_query.rows });
    } catch(err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});
module.exports = router;