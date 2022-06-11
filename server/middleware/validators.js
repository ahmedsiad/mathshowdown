
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

module.exports = {
    RegisterValidator
};