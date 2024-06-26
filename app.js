const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize= require('express-mongo-sanitize')
const hpp = require('hpp')
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler =require('./controllers/errrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes');


const app = express();

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

// 1)Global MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname,'public')));
// Set security HTTP headers
app.use(helmet())

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter=rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many request from this IP, please try again in a hour'
})

app.use('/api',limiter)

// Body Parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter)

app.all('*',(req,res,next) =>{
  next(new AppError(`Cant find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);


module.exports = app;
