import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import connectDb from "./config/initDb.js";

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get('/',(req,res) => {
    res.send("welcom to my server");
})
app.use('/user',userRoutes);
app.use('/event',eventRoutes);


const port = process.env.PORT || 3000;
connectDb();
app.listen(port,() => {
    console.log(`server is runnimg on port: ${port}`);
})
