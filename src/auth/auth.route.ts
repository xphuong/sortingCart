import express from "express";
import { checkAuth } from "../middleware/auth";
import { AuthValid } from "../validation/auth.validation";
import { login, logout, register, tokenRefresh } from "./auth.controller";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/register", validate(AuthValid.register), register);

router.post("/login", validate(AuthValid.login), login);

router.get("/logout", checkAuth, logout)

router.post("/refresh-token", validate(AuthValid.tokenRefresh), checkAuth, tokenRefresh)

export default router
