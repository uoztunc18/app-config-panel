import { Router } from "express";
import { isAuthenticated } from "../middleware/is-auth.js";
import {
    getSuggestion
} from "../controllers/aiController.js";

const aiRoutes = Router();

aiRoutes.post("/", isAuthenticated, getSuggestion);

export default aiRoutes;
