const router = require("express").Router();
const pool = require("../config/db");
const authorized = require("../middleware/authorization");
const { ContestValidator } = require("../middleware/validators");

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

router.get("/", async(req, res) => {
    try {
        const contest_query = await pool.query("SELECT * FROM contests");

        return res.status(200).json({ success: true, contests: contest_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/", authorized, ContestValidator, async(req, res) => {
    try {
        const { title, division, startTime, endTime, authors, problems } = req.body;

        const contest_query = await pool.query("INSERT INTO contests (title, division, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, division, startTime, endTime]);

        const contest_id = contest_query.rows[0].id;
        for (const author_id of authors) {
            const author_query = await pool.query("INSERT INTO authors (user_id, contest_id) VALUES ($1, $2)", [author_id, contest_id]);
        }
        for (let i = 0; i < problems.length; i++) {
            const prob = problems[i];
            const problem_index = String.fromCharCode(65 + i);
            const problem_query = await pool.query(`INSERT INTO problems (title, problem_index, problem_text, answer, image_url, contest_id)
                VALUES ($1, $2, $3, $4, $5, $6)`, [prob.title, problem_index, prob.description, prob.answer, prob.image, contest_id]);
        }

        return res.status(201).json({ success: true, message: "Contest successfully created!" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;