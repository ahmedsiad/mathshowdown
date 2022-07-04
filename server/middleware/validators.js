
const RegisterValidator = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username.match(/^[0-9a-z]+$/i) || username.length < 3 || username.length > 32) {
            return res.status(400).json({ success: false, message: "Invalid Username" });
        }
        if (password.length < 6 || password.length > 64) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }

        // email validator soon

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const ContestValidator = async(req, res, next) => {
    try {
        const { title, division, startTime, endTime, authors, problems } = req.body;

        if (title.length === 0 || title.length > 64) {
            return res.status(400).json({ success: false, message: "Invalid Contest Title" });
        }
        if (typeof division !== "number" || division !== 1 && division !== 2) {
            return res.status(400).json({ success: false, message: "Invalid Division" });
        }
        if (startTime < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid Start Time" });
        }
        if (endTime <= startTime) {
            return res.status(400).json({ success: false, message: "Invalid End Time" });
        }
        if (authors.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid Authors" });
        }
        if (problems.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid Problems" });
        }
        
        for (const prob of problems) {
            if (prob.title.length === 0 || prob.title.length > 64) {
                return res.status(400).json({ success: false, message: "Invalid Problem Title" });
            }
            if (prob.description.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid Problem Description" });
            }
            if (prob.answer.length === 0 || prob.answer.length > 32) {
                return res.status(400).json({ success: false, message: "Invalid Problem Answer" });
            }
            if (prob.image.length > 64) {
                return res.status(400).json({ success: false, message: "Invalid Image URL" });
            }
        }

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const SubmissionValidator = async(req, res, next) => {
    try {
        const { answer } = req.body;
        
        if (answer.length === 0 || answer.length > 32) {
            return res.status(400).json({ success: false, message: "Invalid submission" });
        }

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    RegisterValidator,
    ContestValidator,
    SubmissionValidator
};