import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/userRoutes.js'
import errorMiddleware from './middleware/error_middleware.js'
import courseRoutes from './routes/courseRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import miscRoutes from './routes/miscellaneous_routes.js';
dotenv.config()
const app=express()


app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
app.use(cors({
    origin: "https://lms-v1wq.onrender.com", 
    credentials: true // Allow cookies and other credentials
}));
app.use(morgan('dev'))
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/payments',paymentRoutes)
app.use('/api/v1', miscRoutes);
app.use('/ping',(req,res)=>{
    res.send("lms set up started")
})
//in case of some invalid url request
app.all('*',(req,res)=>{
    res.status(404).send(
        "404 page not found"
    )
})
app.use(errorMiddleware)//genric error middleware
export default app;
