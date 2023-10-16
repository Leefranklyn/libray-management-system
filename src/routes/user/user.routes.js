import { Router } from "express";
import { verifyToken } from "../../middlewares/jwt.js";
import upload from "../../config/multer.js";
import { userLogin, userRegistration } from "../../controllers/auth/user.auth.controller.js";
import { borrowBook, checkBorrowedAudiobook, checkBorrowedEbook, getUser, getUsersBorrowedBooks, payCash, returnBook, updateUser, uploadUserProfilePhoto } from "../../controllers/user/user.controller.js";
const router = Router();

router.post("/signup", userRegistration);
router.post("/login", userLogin);
router.get("/", verifyToken("user"), getUser);
router.post("/uploadprofile",  verifyToken("user"), upload("user").single("profilePhoto"), uploadUserProfilePhoto);
router.patch("/update", verifyToken("user"), updateUser);
router.post("/book/borrow", verifyToken("user"), borrowBook);
router.post("/book/checkebookborrowedstatus/:bookId", verifyToken("user"), checkBorrowedEbook);
router.post("/book/checkaudiobookborrowedstatus/:bookId", verifyToken("user"), checkBorrowedAudiobook);
router.get("/books/borrowed", verifyToken("user"), getUsersBorrowedBooks);
router.patch("/book/return/:bookId", verifyToken("user"), returnBook);
router.patch("/book/return/cashpayment/:bookId", verifyToken("user"), payCash);

export default router;