import mongoose from "mongoose";
///mongoose configuration
mongoose.set('strictQuery',false)//means i wont be querying in strict mode if i passes an extra parameter or asks for extra parameter ignore that dont generate an error
const connectToDb=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database succesfully connectd");
    } catch (error) {
        console.log(err.message);
        process.exit(1);
    }
}
export default connectToDb;