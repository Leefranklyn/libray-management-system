import { Router } from "express";
import { verifyToken } from "../../middlewares/jwt.js";
import upload from "../../config/multer.js";
import { adminLogin, adminRegistration } from "../../controllers/auth/admin.auth.controller.js";
import { addPyhsicalUserAndBorrowBook, disableUser, getAdmin, getAllUsers, getUsersWithBorrowedBooks, getUsersWithBorrowedBooksDue, updateAdmin, uploadAdminProfilePhoto } from "../../controllers/admin/admin.controller.js";
const router = Router();

router.post("/signup", adminRegistration);
router.post("/login", adminLogin);
router.get("/", verifyToken("admin"), getAdmin);
router.get("/users", verifyToken("admin"), getAllUsers);
router.get("/users/borrowed", verifyToken("admin"), getUsersWithBorrowedBooks);
router.get("/users/borrowed/due", verifyToken("admin"), getUsersWithBorrowedBooksDue);
router.post("/uploadprofile",  verifyToken("admin"), upload("admin").single("profilePhoto"), uploadAdminProfilePhoto);
router.patch("/update",  verifyToken("admin"), updateAdmin);
router.post("/users/adduser",  verifyToken("admin"), addPyhsicalUserAndBorrowBook);
router.post("/users/ban/:userId",  verifyToken("admin"), disableUser);


export default router;