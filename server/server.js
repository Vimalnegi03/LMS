import app from "./app.js";
import connectToDb from "./config/db.js";
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'
const PORT=process.env.PORT||3002

//cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
    
})

app.listen(PORT,async(err)=>{
   await connectToDb();
    if(err) console.log(err)
        console.log(`Server running on port ${PORT}`)
})