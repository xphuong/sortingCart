import express from "express";
import { checkAuth } from "../middleware/auth";
import { cartDelete, cartLog, cartUpdateItem, } from "./cart.controller";
import { validate } from "../middleware/validate";
import { CartValid } from "../validation/cart.validation";

const router = express.Router();


router.get("/log", checkAuth, cartLog)
router.post("/update", validate(CartValid.update), checkAuth, cartUpdateItem)
router.delete("/del", checkAuth, cartDelete)


export default router


