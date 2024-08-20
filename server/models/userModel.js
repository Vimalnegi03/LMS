import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema=new mongoose.Schema({
    name:
    {type:String,
        required:[true,"name is required"],
        minLength:[5,"name must be more than 5 character"],
        maxLength:[50,"name must be less than 50 characters"],
        trim:true,
        lowercase:true
    },
         
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true,"email should be unique"],
            lowercase:true,
            trim:true,
            match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,"please fill a valid email address"]
            
        },
        password:{type:String,
            required:[true,"password is required"],
            select:false,
            minLength:[8,"password must be of minimum length 8 character"]
        },
        subscription: {
            id: String,
            status: String,
          },
        avatar:{
            public_id:{
                type:String,

            },
            secure_url:{
                type:String,
            }
        },
        role:{
           type:String,
           enum:["USER","ADMIN"],//types of user possible
           default:'USER'
        },
        forgotPasswordToken:{
            type:String,
        },
        forgotPasswordExpiry:{
            type:Date,
        },
        
},{timestamps:true})
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        return next()
    this.password=await bcrypt.hash(this.password,10)
    return next();
})
userSchema.methods.generateJWTToken = function() {
    return JWT.sign({
        id: this._id,
        email: this.email,
        subscription:this.subscription,
        role: this.role
    }, process.env.SECRET, { expiresIn: '24h' });
};
userSchema.methods.generatePasswordResetToken=async function()
{
const resetToken=crypto.randomBytes(20).toString('hex');//encrypted token
this.forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');//we will keep encrypted token in db here sha256 is encryption algo .digest('hex')
                                                                                      //to convert in hexadecimal form
this.forgotPasswordExpiry=new Date(Date.now()+3600000);//1 hour
return resetToken;//remember we could have directly set forgotPassword token as resetToken but for more safety we have encrypted this
}
const User=mongoose.model("User",userSchema);
export default User