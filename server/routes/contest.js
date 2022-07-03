const router = require("express").Router();
const pool = require("../config/db");
const authorized = require("../middleware/authorization");
const { ContestValidator, SubmissionValidator } = require("../middleware/validators");
const calculateRatingChanges = require("../utils/ratingChanges");

router.get("/:contest_id", async(req, res) => {
    try {
        const { contest_id } = req.params;

        const contest_query = await pool.query("SELECT * FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }

        return res.status(200).json({ success: true, contest: contest_query.rows[0] });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:contest_id/problems", async(req, res) => {
    try {
        const { contest_id } = req.params;

        const problem_query = await pool.query("SELECT id, title, problem_index FROM problems WHERE contest_id = $1", [contest_id]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }

        return res.status(200).json({ success: true, problems: problem_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:contest_id/problems/:problem_index", async(req, res) => {
    try {
        const { contest_id, problem_index } = req.params;
        const now = Date.now();

        const contest_query = await pool.query("SELECT start_time, graded FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        const contest = contest_query.rows[0];

        if (now < contest.start_time) {
            return res.status(403).json({ success: false, message: "This contest hasn't started!" });
        }

        const problem_query = await pool.query("SELECT * FROM problems WHERE contest_id = $1 AND problem_index = $2", [contest_id, problem_index]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Problem does not exist" });
        }
        const problem = problem_query.rows[0];
        problem.answer = null;
        problem.tags = [];

        if (contest.graded) {
            const tags_query = await pool.query("SELECT t.tag FROM tags t INNER JOIN problem_tags p ON t.id = p.problem_id WHERE p.problem_id = $1",
            [problem.id]);
            problem.tags = tags_query.rows;
        }

        return res.status(200).json({ success: true, problem: problem });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:contest_id/problems/:problem_index/submissions", authorized, async(req, res) => {
    try {
        const { contest_id, problem_index} = req.params;
        const user_id = req.user;

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1 AND problem_index = $2", [contest_id, problem_index]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Problem does not exist" });
        }
        const problem = problem_query.rows[0];

        const participant_query = await pool.query("SELECT id FROM participants WHERE user_id = $1 AND contest_id = $2", [user_id, contest_id]);
        if (participant_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User is not registered for this contest" });
        }
        const participant = participant_query.rows[0];

        const submission_query = await pool.query("SELECT * FROM submissions WHERE participant_id = $1 AND problem_id = $2", [participant.id, problem.id]);

        if (submission_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Submission does not exist" });
        }

        return res.status(200).json({ success: true, submission: submission_query.rows[0]});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:contest_id/problemStatistics", async(req, res) => {
    try {
        const { contest_id } = req.params;

        const contest_query = await pool.query("SELECT graded FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        const contest = contest_query.rows[0];

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1", [contest_id]);
        const problems = problem_query.rows;
        const result = {};

        for (const problem of problems) {
            const total_count_query = await pool.query("SELECT COUNT(*) FROM submissions WHERE problem_id = $1", [problem.id]);
            result[problem.id] = { total_submissions: 0, correct_submissions: 0 };
            result[problem.id].total_submissions = total_count_query.rows[0].count;

            if (contest.graded) {
                const correct_count_query = await pool.query("SELECT COUNT(*) FROM submissions WHERE problem_id = $1 AND verdict = TRUE", [problem.id]);
                result[problem.id].correct_submissions = correct_count_query.rows[0].count;
            }
        }

        return res.status(200).json({ success: true, problem_statistics: result });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/:contest_id/standings", async(req, res) => {
    try {
        const { contest_id } = req.params;
        const page = (req.query.page) ? req.query.page : 0;

        const contest_query = await pool.query("SELECT graded FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        if (!contest_query.rows[0].graded) {
            return res.status(404).json({ success: false, message: "Contest has not been graded" });
        }

        const participant_query = await pool.query(`SELECT p.*, u.username FROM participants p INNER JOIN users u ON u.id = p.user_id
        WHERE p.contest_id = $1 ORDER BY p.rank OFFSET $2 ROWS FETCH NEXT 100 ROWS ONLY`, [contest_id, page * 100]);
        const participants = participant_query.rows;

        for (const participant of participants) {
            const submission_query = await pool.query(`SELECT problem_id, submission_time, verdict FROM submissions WHERE participant_id = $1 
            ORDER BY problem_id`,
            [participant.id]);
            participant.submissions = submission_query.rows;
        }

        const count_query = await pool.query("SELECT COUNT(*) FROM participants WHERE contest_id = $1", [contest_id]);

        return res.status(200).json({ success: true, participants: participants, count: count_query.rows[0].count });
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
        const contests = contest_query.rows;

        for (const contest of contests) {
            const authors_query = await pool.query("SELECT username, rating FROM authors a INNER JOIN users ON a.user_id = users.id AND a.contest_id = $1",
            [contest.id]);
            contest.authors = [...authors_query.rows];
        }

        return res.status(200).json({ success: true, contests: contest_query.rows });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/", authorized, ContestValidator, async(req, res) => {
    try {
        const { title, division, startTime, endTime, authors, problems } = req.body;

        const contest_query = await pool.query("INSERT INTO contests (title, division, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING (id)",
        [title, division, startTime, endTime]);

        const contest_id = contest_query.rows[0].id;
        for (const author_id of authors) {
            const author_query = await pool.query("INSERT INTO authors (user_id, contest_id) VALUES ($1, $2)", [author_id, contest_id]);
        }
        for (let i = 0; i < problems.length; i++) {
            const prob = problems[i];
            const problem_index = String.fromCharCode(65 + i);
            const problem_query = await pool.query(`INSERT INTO problems (title, problem_index, problem_text, answer, image_url, contest_id)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING (id)`, [prob.title, problem_index, prob.description, prob.answer, prob.image, contest_id]);
            
            const problem_id = problem_query.rows[0].id;
            for (const tag_id of prob.tags) {
                const tag_query = await pool.query("INSERT INTO problem_tags (problem_id, tag_id) values ($1, $2)", [problem_id, tag_id]);
            }
        }

        return res.status(201).json({ success: true, message: "Contest successfully created!" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/:contest_id/register", authorized, async(req, res) => {
    try {
        const user_id = req.user;
        const { contest_id } = req.params;

        const participant_query = await pool.query("SELECT * FROM participants WHERE user_id = $1 AND contest_id = $2", [user_id, contest_id]);
        if (participant_query.rows.length > 0) {
            return res.status(409).json({ success: false, message: "User is already registered for this contest!" });
        }

        const user_query = await pool.query("SELECT rating FROM users WHERE id = $1", [user_id]);
        const current_rating = user_query.rows[0].rating;

        const create_query = await pool.query("INSERT INTO participants (user_id, contest_id, rating_before) VALUES ($1, $2, $3)",
        [user_id, contest_id, current_rating]);

        return res.status(201).json({ success: true, message: "User registered for contest" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/:contest_id/grade", authorized, async(req, res) => {
    try {
        const { contest_id } = req.params;

        const contest_query = await pool.query("SELECT * FROM contests WHERE id = $1", [contest_id]);
        if (contest_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Contest does not exist" });
        }
        const contest = contest_query.rows[0];

        if (contest.graded) {
            return res.status(409).json({ success: false, message: "Contest has already been graded" });
        }
        if (Date.now() < contest.end_time) {
            return res.status(400).json({ success: false, message: "Contest hasn't finished yet" });
        }

        await calculateRatingChanges(contest);
        await pool.query("UPDATE contests SET graded = TRUE WHERE id = $1", [contest_id]);

        return res.status(200).json({ success: true, message: "Contest graded" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/:contest_id/problems/:problem_index/submissions", authorized, SubmissionValidator, async(req, res) => {
    try {
        const { contest_id, problem_index } = req.params;
        const { answer } = req.body;
        const user_id = req.user;

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1 AND problem_index = $2", [contest_id, problem_index]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Problem does not exist" });
        }
        const problem = problem_query.rows[0];

        const participant_query = await pool.query("SELECT id FROM participants WHERE user_id = $1 AND contest_id = $2", [user_id, contest_id]);
        if (participant_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User is not registered for this contest" });
        }
        const participant = participant_query.rows[0];

        const submission_query = await pool.query("SELECT * FROM submissions WHERE participant_id = $1 AND problem_id = $2", [participant.id, problem.id]);
        if (submission_query.rows.length !== 0) {
            return res.status(409).json({ success: false, message: "Submission already exists" });
        }
        
        const post_query = await pool.query("INSERT INTO submissions (participant_id, problem_id, answer, submission_time) VALUES ($1, $2, $3, $4)",
        [participant.id, problem.id, answer, Date.now()]);

        return res.status(201).json({ success: true, message: "Submission successfully created" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.delete("/:contest_id/problems/:problem_index/submissions", authorized, async(req, res) => {
    try {
        const { contest_id, problem_index } = req.params;
        const user_id = req.user;

        const problem_query = await pool.query("SELECT id FROM problems WHERE contest_id = $1 AND problem_index = $2", [contest_id, problem_index]);
        if (problem_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Problem does not exist" });
        }
        const problem = problem_query.rows[0];

        const participant_query = await pool.query("SELECT id FROM participants WHERE user_id = $1 AND contest_id = $2", [user_id, contest_id]);
        if (participant_query.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User is not registered for this contest" });
        }
        const participant = participant_query.rows[0];

        const submission_query = await pool.query("DELETE FROM submissions WHERE participant_id = $1 AND problem_id = $2", [participant.id, problem.id]);

        return res.status(200).json({ success: true, message: "Submission successfully deleted" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;