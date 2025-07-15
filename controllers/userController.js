import pool from "../config/db.js";

export const createUserController = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(401).json({ message: "all field required" });
    }

    try {
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(401).json({ message: "user already exist" });
        }

        const newUser = await pool.query(
            `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );
        return res.status(200).json({ message: "user created succesful", user: newUser.rows[0] })

    } catch (error) {
        return res.status(500).json({ error })
    }

}