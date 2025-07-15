import pool from "./db.js";
import eventSchema from "../schema/eventSchema.js";
import registerationSchema from "../schema/registerationSchema.js";
import userSchema from "../schema/userSchema.js";

const connectDb = async () => {
    try {
        await pool.query(userSchema);
        await pool.query(eventSchema);
        await pool.query(registerationSchema);

        console.log("table created");
        
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;