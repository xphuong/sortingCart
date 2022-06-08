import express from "express";
import { checkAuth } from "../middleware/auth";
import { invoiceCreate, invoiceLog, invoiceShow } from "./invoice.controller";

const router = express.Router();

// router.post("/create-invoice", invoiceAdd);

router.get("/log", checkAuth, invoiceLog);
router.get("/show", checkAuth, invoiceShow);
router.get("/create", checkAuth, invoiceCreate);


export default router
