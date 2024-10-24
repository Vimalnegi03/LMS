import AppError from "../utils/err_util.js";
import JWT from 'jsonwebtoken'
import User from "../models/userModel.js";
export const isLoggedIn=async(req,res,next)=>{
    const token=(req.cookies&&req.cookies.token);
    try{
    if(!token)
    {
        return next(new AppError("NOT logged in",400))
    }
  
    JWT.verify(token,process.env.SECRET,async(err,decoded)=>{
        
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new AppError('Your session has expired. Please log in again.', 401));
            }
            return next(new AppError('Invalid token. Please log in again.', 401));
        }

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError("The user belonging to this token no longer exists.", 401));
        }

        console.log(`Logged in user: ${currentUser}`);
        req.user = currentUser;
        next();
    });
} 
catch (error) {
    return next(new AppError(error.message, 401));
}
};
export const authorizedRoles = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role;
    console.log(currentUserRole);
    if (!roles.includes(currentUserRole)) {
        return next(new AppError("Not permitted to access this route", 403));
    }

    next();
};
export const authorizedSubscirbers=async(req,res,next)=>{
    const subscription=req.user.subscription.status;
    const currUserrole=req.user.role;
    if(currUserrole!=='ADMIN'&& subscription!=='active')
    {
        return next(new AppError("Please subscribe to access this route", 403));
    }
    next()
}
