import User from "../models/userModel.js";
import emailValidator from 'email-validator'
import AppError from "../utils/err_util.js";
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import sendEmail from "../utils/sendMail_util.js";
import crypto from 'crypto'
const cookieOption={
    httpOnly:true,
    maxAge:7*24*60*60*1000,//7 days
}
export const Register=async(req,res,next)=>{
    try {
        const {name,email,password,}=req.body;
        if(!name||!email||!password)
        {
           return next(new AppError("All fields are necessary",400))// as new App error gives instance of the error so to get a response from and we need to pass response so we 
                                                              // will pass it to a middle ware using next()
        }
        const valid_mail=emailValidator.validate(email);
        if(!valid_mail)
        {
           return next(new AppError("invalid email",400))
        }
       
        const findUser=await User.findOne({email});
       
        if(findUser){
             return next(new AppError("user already exist",400))
        }
        //user will be saved in databse in two step process
        const user=await User.create({name,
            email,
            password,
            avatar:{
                public_id:email,
                secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            },

        })
        if(!user)
        {
            return next(new AppError("user registration failed pelase try again",400))
        }
        // file upload
        if(req.file)//to upload file in cloudinary
        {
            console.log(req.file);
          try {
            const result=await cloudinary.v2.uploader.upload(req.file.path,{//takes two thing first configuration second path
            folder:'lms',
            height:250,
            width:250,
            gravity:'faces',
            crop:'fill'
            })
            if(result)
            {
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                //now as we have uploaded file so delete that file from local system
                fs.rm(`uploads/${req.file.filename}`)//this command is used to delete the image that is stored in uploads folder during upload in cloudinary 
            }
          } catch (error) {
             return next(new AppError("file not uploaded",404))
          }
        }
        await user.save();
        user.password=undefined
        const token=await user.generateJWTToken();
        res.cookie("token",token,cookieOption)
        res.status(200).json({
            status:"true",
            message:"user successfully registered",
            user
        })
    } catch (error) {
        return next(new AppError(error.message,404));
    }
}

export const Login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email)
        {
            return next(new AppError("mail is required",404));
        }
        if(!password)
        {
            return next(new AppError("password is must",404))
        }
        const user=await User.findOne({email}).select('+password');
        if(!user)
        {
            return next(new AppError("user not found",404))
        }
        if(!await bcrypt.compare(password,user.password))
        {
            return next(new AppError("wrong password",404));
        }
        const Token=await user.generateJWTToken();
        res.cookie("token",Token,cookieOption)
        user.password=undefined;
        res.status(200).json({
            status:"true",
            message:"user successfully logged in",
            user
        })

    } catch (error) {
        return next(new AppError(error.message,400))
    }
}
export const Logout=async(req,res,next)=>{
    try {
        res.cookie('token',null,{
            secure:process.env.NODE_ENV  === 'production' ? true : false,
            maxAge:0,
            httpOnly:true
        })
        res.status(200).json({
            status:"true",
            message:"user successfully logged out"
        })
    } catch (error) {
        return next(new AppError(error.message,400))
        
    }
}
export const getUser=async(req,res,next)=>{
    try{
     const id=req.user.id//this req.user.id is obtained from JWT token
     const user=await User.findById(id);
     if(!user)
     {
        return next(new AppError("user not found",404));
     }
     user.password=undefined;
     res.status(200).json({
        status:"true",
        message:"user successfully fetched",
        user
     })
    }
    catch(e)
    {
      return next(new AppError(e.message,404));
    }
}


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('Received request with body:', req.body); // Log request body

    if (!email) {
      console.log('No email provided in request body');
      return next(new AppError('Please provide email', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with the provided email:', email);
      return next(new AppError('User not found', 404));
    }

    const resetToken = await user.generatePasswordResetToken();
    await user.save(); // Save the new token to the user document

    const resetURL = `${process.env.FRONT_END_URL}/reset_password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking on <a href="${resetURL}" target="_blank">Reset your password</a>`;

    console.log('Sending email to:', email);
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
    console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);
    console.log('FRONT_END_URL:', process.env.FRONT_END_URL);
    console.log('RESET_TOKEN:', resetToken);

    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Error occurred:', error.message, error.stack); // Log detailed error

    // Handle specific email sending error
    if (error.message.includes('Failed to send email')) {
      user.forgotPasswordExpiry = undefined; // For security purposes
      user.forgotPasswordToken = undefined;
      await user.save();
      return next(new AppError('Failed to send email', 500));
    }

    return next(new AppError('An error occurred while processing your request', 500));
  }
};


export const resetPassword=async(req,res,next)=>{
    try {
        const {resetToken}=req.params;//token will be taken from here
        const {password}=req.body;//passsword will be taken from here
        //check  in db if such token exist or not
        const forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
        const user=await User.findOne({forgotPasswordToken,forgotPasswordExpiry:{$gt:Date.now()}})//to match token and to take out that token that have expiry in future
        if(!user)
        {
            return next(new AppError("invalid token",404));
        }
        //in case we found the user
        user.password=password;
        user.forgotPasswordToken=undefined;
        user.forgotPasswordExpiry=undefined;
        user.save();
        res.status(200).json({
            success:true,
            message:"password reset successfully"
        })
    } catch (error) {
        return next(new AppError(error.message,404))
    }
}

export const changePassword=async(req,res,next)=>{
    try {
        const {oldPassword,newPassword}=req.body;
        const id=req.user
        if(!oldPassword||!newPassword)
        {
            return next(new AppError("all fields are mandatory",404))
        }
        const user=await User.findOne({id}).select('+password')
        if(!user)
        {
            return next(new AppError("user not found",404))
        }
        const isPasswordValid=await bcrypt.compare(oldPassword,user.password)
        if(!isPasswordValid)
        {
            return next(new AppError("invalid old password",404))
        }
        user.password=newPassword;
        await user.save();
        user.password=undefined;
        res.status(200).json({
            success:true,
            message:"password changed successfully"
        })
    } catch (error) {
        return next(new AppError(error.message,404))
    }
}


export const updateUser = async (req, res, next) => {
    try {
        const { name } = req.body;
        const id = req.user.id;
        const user = await User.findById(id);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        if (!name) {
            return next(new AppError("Name is mandatory", 400));
        }

        user.name = name; // Assume name is provided and valid

        if (req.file) {
            // If user wants to change the image
            if (user.avatar.public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id); // Delete the previous image
            }

            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                height: 250,
                width: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                // Delete the uploaded file from the local system
                await fs.rm(`uploads/${req.file.filename}`);
            } else {
                return next(new AppError("File not uploaded", 500));
            }
        }

        await user.save();

        res.status(200).json({
            status: "success",
            message: "User details updated successfully",
            data: user
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
     

