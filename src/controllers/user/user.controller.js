import User from "../../models/user/user.model.js";
import Book from "../../models/book/book.model.js";
import Borrow from "../../models/borrow/borrow.model.js";
import { formatZodError } from "../../utils/errorMessage.js";
import { userUpdateValidator } from "../../validators/user/user.validator.js";

export const getUser = async (req, res) => {
  try {
    const id = req.user.id;
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
    const id = req.user.id;
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
    const id = req.user.id;
    console.log(id);
    updateValidatorResult = userUpdateValidator.safeParse(req.body);
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
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    const { borrowDate, returnDate, bookSerialNo, Description } = req.body;
    const book = await Book.findOne({ isbn: bookSerialNo });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    const newBorrowedBook = new Borrow({
      user: user._id,
      book: book._id,
      isbn: bookSerialNo,
      borrowDate: borrowDate,
      returnDate: returnDate,
      Description: Description,
    });
    await newBorrowedBook.save();
    if (newBorrowedBook.success) {
      return (book.status = "Borrowed");
    }
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

export const getUsersBorrowedBooks = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have a user object in req
  
      // Find the most recent borrow record for each book borrowed by the user
      const mostRecentBorrows = await Borrow.aggregate([
        {
          $match: {
            user: userId,
            status: "Borrowed",
          },
        },
        {
          $sort: {
            borrowDate: -1, // Sort in descending order of borrowDate
          },
        },
        {
          $group: {
            _id: "$book",
            mostRecent: { $first: "$$ROOT" }, // Select the first (most recent) borrow for each book
          },
        },
        {
          $replaceRoot: { newRoot: "$mostRecent" }, // Replace the root document with the most recent borrow
        },
      ]).populate({
        path: "book",
        model: "Book", // Use your actual Book model name
      });
  
      // Return the most recent borrowed books as a JSON response
      res.json({
        success: true,
        data: mostRecentBorrows,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch borrowed books." });
    }
  };
  
export const returnBook = async (req, res) => {
  const { bookSerialNo } = req.body;
  const userId = req.user.id;

  try {
    const book = await Book.findOne({ isbn: bookSerialNo });

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

    if (borrow.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    // Check if there's an outstanding fine in the borrow record
    if (borrow.fine > 0) {
      // Assuming you have a function for paying fines
      const finePaid = await payFine(borrow.user, borrow.fine); // Deduct the fine from the user's balance

      if (!finePaid) {
        return res.status(400).json({ message: "Fine payment failed" });
      }
    }

    // Update the borrow record status to 'returned'
    borrow.status = "returned";
    await borrow.save();

    // Update the book status to 'In-Shelf'
    book.status = "In-Shelf";
    await book.save();

    return res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Error Occured",
    });
  }
};
