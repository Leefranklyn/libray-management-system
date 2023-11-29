import User from "../../models/user/user.model.js";
import { createHash } from "node:crypto";
import { formatZodError } from "../../utils/errorMessage.js";
import { userRegistrationValidator, userLoginValidator } from "../../validators/user/user.validator.js";
import jwt from "jsonwebtoken";


export const userRegistration = async (req, res) => {
    try {
        const registrationValidatorResult = userRegistrationValidator.safeParse(req.body);
        if(!registrationValidatorResult.success) {
            return res.status(400).json(formatZodError(registrationValidatorResult.error.issues))
        };
    
        const { fullName, regNo, email, password } = req.body;
    
        const encryptedPassword = createHash("sha256")
        .update(password)
        .digest("base64");
    
        const newUser = new User({
            fullName,
            regNo,
            email,
            password: encryptedPassword
        });
        await newUser.save();
    
        res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            data: newUser
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "User Registeration Failed",
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        const loginValidatorResult = userLoginValidator.safeParse(req.body);
        if(!loginValidatorResult.success) {
            return res.status(400).json(formatZodError(loginValidatorResult.error.issues));
        };
    
        const { email, password } = req.body;
    
        const user = await User.findOne({email: email});
        if(user.disabled === true) {
            return res.status(403).json({
                message: "You No Longer Have Access To This Service"
            });
        };
        if(!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        };
    
        const encryptedPassword = createHash("sha256").update(password).digest("base64");
    
        if(user.password !== encryptedPassword) {
            return res.status(400).json({
                message: "User Email Or Password Incorrect"
            });
        };
    
        const token = jwt.sign({
            id: user._id,
            useType: "user"
        }, process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
        );
    
        const userInfo = {
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            regNo: user.regNo,
            email: user.email,
            phoneNumber: user.phoneNumber,
            bio: user.bio
        };
    
        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userInfo,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "User Login Failed",
        });
    }
};
