require("dotenv").config();

const express = require("express");
const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/" , (req, res) => {
    res.send("SIH Backend is running");
});

app.listen(3000 , () => {
    console.log("server running on port 3000");
})