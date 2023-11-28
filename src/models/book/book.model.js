import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    bookName: {
      type: String,
      unique: true,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: true
    },
    eBook: {
      type: String,
      default: "",
    },
    audioBook: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Romance",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "Self-Help",
        "History",
        "Thriller",
        "Horror",
        "Poetry",
        "Business",
        "Travel",
        "Cookbooks",
        "Science",
        "Technology",
        "Health and Wellness",
        "Children's Books",
        "Young Adult (YA)",
      ],
    },
    hardCopyFormat: {
      type: Boolean,
      default: false,
    },
    eBookFormat: {
      type: Boolean,
      default: false,
    },
    audioBookFormat: {
      type: Boolean,
      default: false,
    },
    status: {
        type: String,
        enum: ["Borrowed", "In-Shelf"],
        default: "In-Shelf"
    }
  },
  {
    timeseries: true,
  }
);

export default model("Book", bookSchema);
