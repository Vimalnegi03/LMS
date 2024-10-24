import express from 'express'
import { Register,Login ,Logout,getUser,forgotPassword,resetPassword,changePassword,updateUser} from '../controller/userController.js';
import {isLoggedIn} from '../middleware/auth_middleware.js';
import upload from '../middleware/multer_middleware.js';
const userRoutes=express.Router();

userRoutes.post('/register',upload.single('avatar'),Register)//upload.single('avatar') means upload a single file with name key
userRoutes.post('/login',Login)
userRoutes.get('/logout',Logout)
userRoutes.get('/me',isLoggedIn,getUser)
userRoutes.post('/reset',forgotPassword)
userRoutes.post('/reset/:resetToken',resetPassword)
userRoutes.post('/change_password',isLoggedIn,changePassword)
userRoutes.put('/update/:id',isLoggedIn,upload.single('avatar'),updateUser)
export default userRoutes