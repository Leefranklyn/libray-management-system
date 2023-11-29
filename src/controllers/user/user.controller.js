import User from "../../models/user/user.model.js";
import Book from "../../models/book/book.model.js";
import Borrow from "../../models/borrow/borrow.model.js";
import { formatZodError } from "../../utils/errorMessage.js";
import { userUpdateValidator } from "../../validators/user/user.validator.js";

export const getUser = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin Not Found",
      });
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could Not fetch User Data",
    });
  }
};

export const uploadUserProfilePhoto = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    const profilePhoto = req.file;
    const profilePhotoUrl = profilePhoto.path;

    res.status(200).json({
      success: true,
      message: "profilePhoto Uploaded Successfully",
      profilePhoto: profilePhotoUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "upload Failed",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    const updateValidatorResult = userUpdateValidator.safeParse(req.body);
    if (!updateValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(updateValidatorResult.error.issues));
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Data Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could Not Update User Data",
    });
  }
};

export const borrowBook = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const { borrowDate, returnDate, bookSerialNo, description } = req.body;
    const book = await Book.findOne({ isbn: bookSerialNo });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }

    if (book.status === "Borrowed") {
      return res.status(400).json({
        success: false,
        message: "Book Not Available At The Moment",
      });
    }
    const borrowedBook = await Borrow.findOne({
      user: id,
      book: book._id
    });
    
    if(borrowedBook) {
      return res.status(400).json({
        success: false,
        message: "Book Already Borrowed By User",
      });
    }
    
    const newBorrowedBook = new Borrow({
      user: user._id,
      book: book._id,
      isbn: bookSerialNo,
      bookName: book.bookName,
      borrowDate: borrowDate,
      returnDate: returnDate,
      Description: description,
    });

    await newBorrowedBook.save();

    // Update the book status to "Borrowed"
    // book.status = "Borrowed";
    // await book.save();

    res.status(200).json({
      success: true,
      message: "Book Borrowed Successfully",
      borrowedBook: newBorrowedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed To Borrow Book",
    });
  }
};

export const checkBorrowedEbook = async (req, res) => {
  try {
    const userId = req.user; // Assuming you have a user object in req
    const bookId = req.params.bookId; // Assuming you have a route parameter for bookId

    // Check if the user has borrowed the book with the given bookId
    const borrowedBook = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["Borrowed", "Due"] },
    });

    if (!borrowedBook) {
      return res.status(403).json({
        success: false,
        message: "You must borrow this book before accessing the ebook.",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    const eBook = book.eBook;

    // If the user has borrowed the book, you can allow them to access the ebook here
    res.status(200).json({
      success: true,
      message: "You can now access the ebook.",
      eBook: eBook,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error checking borrowed book." });
  }
};

export const checkBorrowedAudiobook = async (req, res) => {
  try {
    const userId = req.user; // Assuming you have a user object in req
    const bookId = req.params.bookId; // Assuming you have a route parameter for bookId

    // Check if the user has borrowed the book with the given bookId
    const borrowedBook = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["Borrowed", "Due"] },
    });

    if (!borrowedBook) {
      return res.status(403).json({
        success: false,
        message: "You must borrow this book before accessing the audiobook.",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    const audioBook = book.audioBook;

    // If the user has borrowed the book, you can allow them to access the ebook here
    res.status(200).json({
      success: true,
      message: "You can now access the audiobook.",
      audioBook: audioBook,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error checking borrowed book." });
  }
};

export const getUsersBorrowedBooks = async (req, res) => {
  try {
    const userId = req.user; // Assuming you have a user object in req
    const borrowedBooks = await Borrow.find({
      user: userId,
      status: "Borrowed",
    }).populate({
      path: "book",
      model: "Book", // Use your actual Book model name
    });

    // Return the most recent borrowed books as a JSON response
    res.json({
      success: true,
      borrowedBooks: borrowedBooks,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch borrowed books." });
  }
};

// export const returnBook = async (req, res) => {
//   const { bookSerialNo } = req.body;
//   const userId = req.user;

//   try {
//     const book = await Book.findOne({ isbn: bookSerialNo });

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     const borrow = await Borrow.findOne({
//       user: userId,
//       book: book._id, // Make sure it's currently borrowed
//     });

//     if (!borrow) {
//       return res.status(404).json({ message: "Borrow record not found" });
//     }

//     if (borrow.status === "Returned") {
//       return res.status(400).json({ message: "Book already returned" });
//     }

//     // Check if there's an outstanding fine in the borrow record
//     if (borrow.fine > 0) {
//       // Assuming you have a function for paying fines
//       const finePaid = await payFine(borrow.user, borrow.fine); // Deduct the fine from the user's balance

//       if (!finePaid) {
//         return res.status(400).json({ message: "Fine payment failed" });
//       }
//     }

//     // Update the borrow record status to 'returned'
//     borrow.status = "returned";
//     await borrow.save();

//     // Update the book status to 'In-Shelf'
//     book.status = "In-Shelf";
//     await book.save();

//     return res.status(200).json({ message: "Book returned successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An Error Occured",
//     });
//   }
// };

export const returnBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const borrow = await Borrow.findOne({
      user: userId,
      book: book._id, // Make sure it's currently borrowed
    });

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    };

    // if (borrow.status === "Returned") {
    //   return res.status(400).json({ message: "Book already returned" });
    // };

    if (borrow.fine !== 0) {
      return res.status(400).json({
        success: false,
        message: "There is An Outstanding Fine To Be Paid",
      });
    }

    await Borrow.findByIdAndDelete(borrow._id);
    // book.status = "In-Shelf";

    // await book.save();
    res.status(200).json({
      success: true,
      message: "Book Returned Successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to Return Borrowed Book." });
  }
};

export const payCash = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const borrow = await Borrow.findOne({
      user: userId,
      book: book._id, // Make sure it's currently borrowed
    });

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // if (borrow.status === "Returned") {
    //   return res.status(400).json({ message: "Book already returned" });
    // }

    borrow.paymentStatus = "Pending";

    await borrow.save();
    res.status(200).json({
      success: true,
      message: "Success. Awaiting payment Confirmation",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An Error Occured While Making The Payment.",
      });
  }
};
