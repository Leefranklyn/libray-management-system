import Admin from "../../models/admin/admin.model.js";
import User from "../../models/user/user.model.js";
import Borrow from "../../models/borrow/borrow.model.js";
import Book from "../../models/book/book.model.js";
import { adminUpdateValidator } from "../../validators/admin/admin.validator.js";

export const getAdmin = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    const admin = await Admin.findOne({ _id: id }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin Not Found",
      });
    }
    res.status(200).json({
      success: true,
      admin: admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could Not fetch Admin Data",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({});
    if (!users || userCount === 0) {
      return res
        .status(404)
        .json({ totalUsers: userCount, message: "No Users Found", users: [] });
    }

    res.status(200).json({
      success: true,
      totalUsers: userCount,
      users: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchForUser = async (req, res) => {
  try{
    const regNo = req.params.regno;
    const user = await User.findOne({ regNo : regNo});
    if(!user) {
     return res
        .status(404)
        .json({success: false, message: "User Not Found"});
    };
    
    const borrowedBooks = await Borrow.find({
      user: user._id,
      status: "Borrowed",
    }).populate({
      path: "book",
      model: "Book", // Use your actual Book model name
    });

    // Return the most recent borrowed books as a JSON response
    res.json({
      success: true,
      User: user,
      borrowedBooks: borrowedBooks,
    });
  }catch(error) {
     res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUsersWithBorrowedBooks = async (req, res) => {
  try {
    // Count the total number of users with borrowed books
    const userCount = await Borrow.countDocuments({ status: "Borrowed" });

    // Find all borrow records with a status of 'Borrowed' (excluding 'Returned')
    const borrowedBooks = await Borrow.find({ status: "Borrowed" })
      .populate({
        path: "user",
        model: "User", // Use your actual User model name
      })
      .populate({
        path: "book",
        model: "Book", // Use your actual Book model name
      });

    if (!borrowedBooks || userCount === 0) {
      return res.status(404).json({
        totalUsers: userCount,
        message: "No Borrowed Books",
        data: [],
      });
    }

    // Return the borrowed books along with user and book information
    res.json({
      success: true,
      totalUsers: userCount,
      data: borrowedBooks,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch borrowed books." });
  }
};

export const getUsersWithBorrowedBooksDue = async (req, res) => {
  try {
    // Find all Borrow documents with a status of "Due"
    const userCount = await Borrow.countDocuments({ status: "Due" });

    const userBorrowedBooksDue = await Borrow.find({ status: "Due" })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "book",
        model: "Book",
      });

    if (!userBorrowedBooksDue || userCount === 0) {
      return res.status(404).json({
        totalUsers: userCount,
        message: "No Due Books Found",
        data: [],
      });
    }
    res.json({
      success: true,
      totalUsers: userCount,
      data: userBorrowedBooksDue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch data." });
  }
};

export const uploadAdminProfilePhoto = async (req, res) => {
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

export const updateAdmin = async (req, res) => {
  try {
    const id = req.user;
    console.log(id);
    const updateValidatorResult = adminUpdateValidator.safeParse(req.body);
    if (!updateValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(updateValidatorResult.error.issues));
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin Data Updated Successfully",
      user: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could Not Update Admin Data",
    });
  }
};

export const addPyhsicalUserAndBorrowBook = async (req, res) => {
  try {
    const {
      fullName,
      email,
      regNo,
      phoneNumber,
      profilePhoto,
      borrowDate,
      returnDate,
      bookName,
      bookSerialNo,
      description,
    } = req.body;

    const newUser = new User({
      fullName,
      regNo,
      email,
      phoneNumber,
      profilePhoto,
      password: "123456",
    });
    await newUser.save();

    const book = await Book.findOne({ isbn: bookSerialNo });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    // if (book.status === "Borrowed") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Book Not Available At The Moment",
    //   });
    // };

    const newBorrowedBook = new Borrow({
      user: newUser._id,
      book: book._id,
      bookName: bookName,
      isbn: bookSerialNo,
      Description: description,
      borrowDate: borrowDate,
      returnDate: returnDate,
    });

    await newBorrowedBook.save();
    
    // if (newBorrowedBook.success) {
    //   return (book.status = "Borrowed");
    // }
    res.status(200).json({
      success: true,
      message: "User Added and Book Successfully Borrowed",
      user: newUser,
      bookBorrowed: newBorrowedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could Not Add User And Borrow Book",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    await Borrow.findByIdAndDelete(borrow._id);

    book.status = "In-Shelf";
    await book.save();
    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Paymnet Verification Failed",
    });
  }
};

export const disableUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Set the 'disabled' field to true to disable the user
    user.disabled = true;

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User disabled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An Error Occured While Disabling User",
    });
  }
};
