const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.payh}: ${err.value}.`;
    return new AppError(message,400);
};

const handleDublicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    //const value = err.keyValue.name;

    const message = `Duplicate field value ${value}. Please use another name`;
    return new AppError(message,401);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message =`Invalid input data. ${errors.join('. ')}`;
    return new AppError(message,402);
};

const sendErrorDev = (err,res) =>{
    res.status(404).json({ 
        status:err.status,
        error:err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err,res) =>{
    //Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(404).json({
            status:err.status,
            message: err.message,
        })
    } else {

        // 1) Log Error
        console.error('ERROR !!',err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! '
        })
    }
}
module.exports=(err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.status= err.status || 'error';
    
    if(process.env.NODE_ENV ==='development'){
        sendErrorDev(err,res)         
    } else if (process.env.NODE_ENV==='production'){
        let error = { ...err };

        console.log("semco\n")
        console.log(error.name)

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.Code === 11000) error=handleDublicateErrorDB(error);
        if(error.name === 'ValidationError')
         error=handleValidationErrorDB(error); 

        sendErrorProd(error,res)
    }
}