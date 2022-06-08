import  Express  from "express";
import { UserValidation } from "../validation/auth.validation";
import { deleteUser, getUser, updateUser } from "./user.controller";
import { validate } from "../middleware/validate";
import { checkAuth, checkRole } from "../middleware/auth";

const router = Express.Router();

router.get("/:id", checkAuth, checkRole(["admin"]), getUser);
router.post("/:id", checkAuth, checkRole(["admin"]), updateUser);
router.delete("/:id", checkAuth, checkRole(["admin"]), deleteUser);


// router.get("/",validate(UserValidation.getUser), checkAuth, checkRole, getUser);
// router.post("/:id",validate(UserValidation.updateUser), checkAuth, checkRole, updateUser);
// router.delete("/:id",validate(UserValidation.deleteUser), checkAuth, checkRole, deleteUser);

export default router
