import { Schema, model } from "mongoose";

const borrowSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book"
    },
    bookName: {
        type: String
    },
    isbn: {
        type: String
    },
    borrowDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    fine: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Borrowed", "Due", "Returned"],
        default: "Borrowed"
    }
}, {
    timestamps: true
})

export default model("Borrow", borrowSchema);