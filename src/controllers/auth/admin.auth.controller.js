import Admin from "../../models/admin/admin.model.js";
import { createHash } from "node:crypto";
import { formatZodError } from "../../utils/errorMessage.js";
import { adminRegistrationValidator, adminLoginValidator } from "../../validators/admin/admin.validator.js";
import jwt from "jsonwebtoken";


export const adminRegistration = async (req, res) => {
    try {
        const registrationValidatorResult = adminRegistrationValidator.safeParse(req.body);
        if(!registrationValidatorResult.success) {
            return res.status(400).json(formatZodError(registrationValidatorResult.error.issues))
        };
    
        const { fullName, regNo, email, password } = req.body;
    
        const encryptedPassword = createHash("sha256")
        .update(password)
        .digest("base64");
    
        const newAdmin = new Admin({
            fullName,
            regNo,
            email,
            password: encryptedPassword
        });
        await newAdmin.save();
    
        res.status(200).json({
            success: true,
            message: "Admin Registered Successfully",
            data: newAdmin
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Admin Registeration Failed",
        });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const loginValidatorResult = adminLoginValidator.safeParse(req.body);
        if(!loginValidatorResult.success) {
            return res.status(400).json(formatZodError(loginValidatorResult.error.issues));
        };
    
        const { email, password } = req.body;
    
        const admin = await Admin.findOne({email: email});
    
        if(!admin) {
            return res.status(404).json({
                message: "Admin Not Found"
            });
        };
    
        const encryptedPassword = createHash("sha256").update(password).digest("base64");
    
        if(admin.password !== encryptedPassword) {
            return res.status(400).json({
                message: "Admin Email Or Password Incorrect"
            });
        };
    
        const token = jwt.sign({
            id: admin._id,
            useType: "admin"
        }, process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
        );
    
        const adminInfo = {
            fullName: admin.fullName,
            profilePhoto: admin.profilePhoto,
            regNo: admin.regNo,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            bio: admin.bio
        };
    
        res.status(200).json({
            success: true,
            message: "Login Successful",
            admin: adminInfo,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Admin Login Failed",
        });
    }
};
