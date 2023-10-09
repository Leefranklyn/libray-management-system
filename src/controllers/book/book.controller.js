import Book from "../../models/book/book.model.js";
import { formatZodError } from "../../utils/errorMessage.js";
import {
  bookRegistrationValidator,
  bookUpdateValidator,
} from "../../validators/book/book.validator.js";


export const uploadEBook = async(req, res) => {
  try {
    const eBook = req.files;
    const eBookUrl = eBook.path;
  
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      eBook: eBookUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "File Upload Failed"
    });
  };
};

export const uploadAudioBook = async(req, res) => {
  try {
    const audioBook = req.files;
    const audioBookUrl = audioBook.path;
  
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      audioBook: audioBookUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "File Upload Failed"
    });
  };
};

export const uploadCoverImage = async(req, res) => {
  try {
    const coverImage = req.files;
    const coverImageUrl = coverImage.path;
  
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      coverImage: coverImageUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "File Upload Failed"
    });
  };
};

export const addBook = async (req, res) => {
  try {
    const registrationValidatorResult = bookRegistrationValidator.safeParse(
      req.body
    );
    if (!registrationValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(registrationValidatorResult.error.issues));
    }

    const {
      bookName,
      authorName,
      isbn,
      about,
      coverImage,
      audioBook,
      eBook,
      category,
      hardCopyFormat,
      audioBookFormat,
      eBookFormat,
    } = req.body;

    const newBook = new Book({
      bookName,
      authorName,
      about,
      isbn,
      coverImage,
      audioBook,
      eBook,
      category,
      hardCopyFormat,
      audioBookFormat,
      eBookFormat,
    });
    await newBook.save();
    res.status(200).json({
      success: true,
      message: "Book Added Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed In Adding Book",
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Books Not Found",
      });
    }
    res.status(200).json({
      success: true,
      books: books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};

export const getBooksByCateogory = async (req, res) => {
  try {
    const { category } = req.query;
    const books = await Book.find({ category });
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Could Not Find Books By This Category",
      });
    }
    res.status(200).json({
      success: true,
      books: books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};

export const getBookByBookName = async (req, res) => {
  try {
    const { bookName } = req.query;
    const books = await Book.find({
      bookName: { $regex: bookName, $options: "i" },
    });
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Could Not Find Books By This Name",
      });
    }
    res.status(200).json({
      success: true,
      books: books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching books",
    });
  }
};

export const getBookByAuthorName = async (req, res) => {
    try {
      const { authorName } = req.query;
      const books = await Book.find({
        authorName: { $regex: authorName, $options: "i" },
      });
      if (!books) {
        return res.status(404).json({
          success: false,
          message: "Could Not Find Books By This Author's Name",
        });
      }
      res.status(200).json({
        success: true,
        books: books,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching books",
      });
    }
  };

export const updateBook = async (req, res) => {
  try {
    const updateValidatorResult = bookUpdateValidator.safeParse(req.body);
    if (!updateValidatorResult) {
      return res
        .status(400)
        .json(formatZodError(updateValidatorResult.error.issues));
    }

    const {
      bookId,
      bookName,
      authorName,
      isbn,
      about,
      coverImage,
      audioBook,
      eBook,
      hardCopyFormat,
      audioBookFormat,
      eBookFormat,
    } = req.body;

    const book = await Book.findByIdAndUpdate(
      bookId,
      { $set: req.body },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Updated Book Data Successfully",
      book: book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while Updating Books",
    });
  }
};