const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());

const PORT = 3000;

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Assignment Portal API is running"
    });
});
app.get("/assignments", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM assignments
             ORDER BY id DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});
app.post("/assignments", async (req, res) => {
    try {
        const { title, deadline } = req.body;

        const result = await pool.query(
            `INSERT INTO assignments (title, deadline)
             VALUES ($1, $2)
             RETURNING *`,
            [title, deadline]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});