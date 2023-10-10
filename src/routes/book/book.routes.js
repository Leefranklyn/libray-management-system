import { Router } from "express";
import { verifyToken } from "../../middlewares/jwt.js";
import upload from "../../config/multer.js";
import { addBook, getAllBooks, getBooksByQuery, updateBook, uploadAudioBook, uploadCoverImage, uploadEBook } from "../../controllers/book/book.controller.js";
const router = Router();

router.post("/upload/ebook", verifyToken("admin"), upload("user").single("eBook"), uploadEBook);
router.post("/upload/audiobook", verifyToken("admin"), upload("user").single("audioBook"), uploadAudioBook);
router.post("/upload/coverimage",  verifyToken("admin"), upload("user").single("coverImage"), uploadCoverImage);
router.post("/add", verifyToken("admin"), addBook);
router.get("/", getAllBooks);
router.get("/search", getBooksByQuery);
// router.get("/"),  verifyToken("admin"), getBookByBookName;
// router.get("/"),  verifyToken("admin"), getBookByAuthorName;
router.patch("/update", verifyToken("admin"), updateBook);


export default router;