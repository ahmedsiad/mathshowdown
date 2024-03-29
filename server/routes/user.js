const router = require("express").Router();
const pool = require("../config/db");
const { Authorized } = require("../middleware/authorization");

router.get("/profile/:username", async(req, res) => {
    try {
        const { username } = req.params;
        
        const user_query = await pool.query("SELECT id, username, rating, registration_date FROM users WHERE username = $1", [username]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const user = user_query.rows[0];
        const history = await pool.query(`SELECT * FROM participants p INNER JOIN contests c ON c.id = p.contest_id
        WHERE p.user_id = $1 AND c.graded = TRUE ORDER BY c.start_time`, [user.id]);

        user.contest_history = history.rows;

        return res.status(200).json({ success: true, user: user });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

// get user via auth token
router.get("/profile/", Authorized, async(req, res) => {
    try {
        const user_id = req.user;
        
        const user_query = await pool.query("SELECT id, username, rating, registration_date FROM users WHERE id = $1", [user_id]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const user = user_query.rows[0];
        const history = await pool.query("SELECT * FROM participants WHERE user_id = $1", [user_id]);

        user.contest_history = history.rows;

        return res.status(200).json({ success: true, user: user });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/profile/:username/contests/:contest_id/submissions", async(req, res) => {
    try {
        const { username, contest_id } = req.params;

        const user_query = await pool.query("SELECT id, username, rating FROM users WHERE username = $1", [username]);
        if (user_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        const user = user_query.rows[0];

        const contest_query = await pool.query("SELECT * FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        if (!contest_query.rows[0].graded) {
            return res.status(404).json({ success: false, message: "Contest has not been graded" });
        }
        const contest = contest_query.rows[0];

        const participant_query = await pool.query("SELECT id FROM participants WHERE user_id = $1 AND contest_id = $2", [user.id, contest.id]);
        if (participant_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User is not registered for this contest" });
        }
        const participant = participant_query.rows[0];

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1", [contest.id]);
        const problem_ids = problem_query.rows.map((p) => p.id);

        const submissions_query = await pool.query(`SELECT s.*, p.title, p.problem_index FROM submissions s INNER JOIN problems p
        ON p.id = s.problem_id WHERE s.participant_id = $1 AND s.problem_id = ANY ($2)`,
        [participant.id, problem_ids]);

        return res.status(200).json({ success: true, user: user, contest: contest, submissions: submissions_query.rows });
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
        
        return res.status(200).json({ success: true, user: user_query.rows[0] });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/contests/:contest_id/submissions", Authorized, async(req, res) => {
    try {
        const { contest_id } = req.params;
        const user_id = req.user;

        const participant_query = await pool.query("SELECT id FROM participants WHERE user_id = $1 AND contest_id = $2", [user_id, contest_id]);
        if (participant_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User is not registered for this contest" });
        }
        const participant = participant_query.rows[0];

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1", [contest_id]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        const problem_ids = problem_query.rows.map((p) => p.id);

        const submissions_query = await pool.query("SELECT * FROM submissions WHERE participant_id = $1 AND problem_id = ANY ($2)",
        [participant.id, problem_ids]);

        return res.status(200).json({ success: true, submissions: submissions_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/", async(req, res) => {
    try {
        const page = (req.query.page) ? req.query.page : 0;
        const limit = (req.query.limit) ? req.query.limit : 100;

        const users_query = await pool.query("SELECT id, username, rating, registration_date, is_admin FROM users ORDER BY rating DESC OFFSET $1 FETCH NEXT $2 ROWS ONLY",
        [page * limit, limit]);

        const count_query = await pool.query("SELECT COUNT(*) FROM users");
        
        return res.status(200).json({ success: true, users: users_query.rows, count: count_query.rows[0].count});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;