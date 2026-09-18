const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const { signup, login } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", login);

// PROTECTED ROUTE
router.get("/me", requireAuth, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

// GET USER ROLE
router.get("/role", requireAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const supabaseUser = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        const { data, error } = await supabaseUser
            .from("profiles")
            .select("role")
            .eq("id", req.user.id);

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: "Profile not found"
            });
        }

        res.json({
            user_id: req.user.id,
            role: data[0].role
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;