//this has been done to save our time that was used in writing again and again that 
// res.status(400).json({}) in case of error
class AppError extends Error{//to extend the error that occurs in the app over main error
constructor(message,statusCode)
{
    super(message)
    this.statusCode=statusCode;
    //stack trace to show on which line we have recived an error
    Error.captureStackTrace(this,this.constructor)
}
}
export default AppError;