import { Router } from "express";
import { createUserController } from "../controllers/userController.js";
const userRoutes = Router();


userRoutes.post('/create',createUserController);

export default userRoutes;