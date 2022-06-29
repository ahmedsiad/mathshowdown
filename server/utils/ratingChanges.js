const pool = require("../config/db");

const calculateRatingChanges = async(contest) => {
    const problem_query = await pool.query("SELECT id, answer FROM problems WHERE contest_id = $1", [contest.id]);
    const problems = {};
    for (const problem of problem_query.rows) {
        problems[problem.id] = problem;
    }

    const participant_query = await pool.query("SELECT * FROM participants WHERE contest_id = $1", [contest.id]);
    const participants = participant_query.rows;

    for (const participant of participants) {
        const submissions_query = await pool.query("SELECT * FROM submissions WHERE participant_id = $1", [participant.id]);
        let solved = 0;
        let penalty = 0;

        for (const submission of submissions_query.rows) {
            let verdict = false;
            if (problems[submission.problem_id].answer === submission.answer) {
                solved += 1;
                penalty += submission.submission_time - contest.start_time;
                verdict = true;
            }
            
            const verdict_query = await pool.query("UPDATE submissions SET verdict = $1 WHERE participant_id = $2 AND problem_id = $3",
            [verdict, submission.participant_id, submission.problem_id]);
        }
        penalty = Math.round(penalty / 1000);
        participant.solved = solved;
        participant.penalty = penalty;

        const results_query = await pool.query("UPDATE participants SET solved = $1, penalty = $2 WHERE id = $3", [solved, penalty, participant.id]);
    }

    // sort by solved then penalty
    participants.sort((a, b) => {
        if (a.solved === b.solved) {
            return a.penalty - b.penalty;
        }
        return b.solved - a.solved;
    });

    let curr_rank = 1;
    let last = 0;
    for (let i = 0; i < participants.length; i++) {
        if (i > 0 && (participants[i].solved !== participants[i - 1].solved || participants[i].penalty !== participants[i - 1].penalty)) {
            curr_rank += i - last;
            last = i;
        }
        
        participants[i].rank = curr_rank;
        const rank_query = await pool.query("UPDATE participants SET rank = $1 WHERE id = $2", [curr_rank, participants[i].id]);
    }

    // calculate rating changes
    for (let i = 0; i < participants.length; i++) {
        const seed = calculateSeed(participants, i, participants[i].rating_before);
        const rank = participants[i].rank;
        const mean = geometricMean(seed, rank);

        const adjusted = binarySearch(participants, i, mean);
        const rating_change = Math.floor((adjusted - participants[i].rating_before) / 2);
        const new_rating = participants[i].rating_before + rating_change;

        console.log(seed, mean, new_rating);
        await pool.query("UPDATE participants SET rating_after = $1 WHERE id = $2", [new_rating, participants[i].id]);
        await pool.query("UPDATE users SET rating = $1 WHERE id = $2", [new_rating, participants[i].user_id]);
    }

}

function binarySearch(participants, i, mean) {
    const lower = 0;
    const upper = 5000;

    let left = lower;
    let right = upper;
    while (left < right) {
        const mid = Math.floor(left + right) / 2;
        const mid_seed = calculateSeed(participants, i, mid);

        if (mid_seed === mean) return mid;
        if (mid_seed < mean) right = mid - 1;
        if (mid_seed > mean) left = mid + 1;
    }
    return left;
} 


function calculateSeed(participants, i, r) {
    let seed = 1;
    for (let j = 0; j < participants.length; j++) {
        if (j == i) continue;
        seed += calculateProbability(participants[j].rating_before, r);
    }
    return seed;
}

function calculateProbability(r1, r2) {
    return 1 / (1 + Math.pow(10, (r2 - r1) / 400));
}

function geometricMean(...args) {
    let product = args.reduce((prev, curr) => prev * curr);
    return Math.pow(product, 1/args.length);
}

module.exports = calculateRatingChanges;