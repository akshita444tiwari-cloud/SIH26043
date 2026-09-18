const supabase = require("../config/supabase");

// SIGNUP
const signup = async (req, res) => {
    console.log("SIGNUP API HIT");

    try {
        const { email, password, name, role } = req.body;

        console.log("BODY:", req.body);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: role
                }
            }
        });

        console.log("SUPABASE RESPONSE:", data, error);

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(201).json({
            message: "Signup successful",
            user: data.user
        });

    } catch (err) {
        console.error("SIGNUP ERROR:", err);

        res.status(500).json({
            error: err.message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    console.log("LOGIN API HIT");

    try {
        const { email, password } = req.body;

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: data.user,
            session: data.session
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        res.status(500).json({
            error: err.message
        });
    }
};


module.exports = {
    signup,
    login
};