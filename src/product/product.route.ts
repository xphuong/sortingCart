import  Express  from "express";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "./product.controller";
import ProductValidation from "../validation/product.validation";
import { validate } from "../middleware/validate";
import { checkAuth, checkRole } from "../middleware/auth";

const router = Express.Router();

router.get("/", validate(ProductValidation.getProducts), getAllProduct);
router.post("/", validate(ProductValidation.createProduct), checkAuth, checkRole(["admin"]), addProduct);
router.put("/:id", validate(ProductValidation.updateProduct), checkAuth, checkRole(["admin"]), updateProduct);
router.delete("/:id", validate(ProductValidation.updateProduct), checkAuth, checkRole(["admin"]), deleteProduct);

export default router
