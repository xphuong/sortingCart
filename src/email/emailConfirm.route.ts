import express from "express";
import { sendVerificationMail, verificationEmail } from "./emailConfirm.controller";

const router = express.Router();

router.post("/",sendVerificationMail);

router.get("/",verificationEmail);


export default router