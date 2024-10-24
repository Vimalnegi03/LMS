const errorMiddleware=(err,req,res,next)=>{//as err has been sent to the first thing that i recieved is err next basically what to do next
    err.statusCode=err.statusCode||500
    err.message=err.message||"something went wrong"
  return res.status(err.statusCode).json({
    success:"false",
    message:err.message,
    stack:err.stack
})
}
export default errorMiddleware;