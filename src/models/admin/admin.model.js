import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    fullName: {
        type: String,
        default: "John Doe"
    },
    profilePhoto: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
    },
    regNo: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: ""
    },
}, {
    timeseries: true
});

export default model("Admin", adminSchema);